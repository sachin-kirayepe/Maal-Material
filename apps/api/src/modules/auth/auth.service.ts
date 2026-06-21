import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "@modules/users/users.service";
import { RegisterDto, LoginDto } from "./dto/auth.dto";
import { AuthResponse, JwtPayload, SystemRole } from "@constructos/types";
import * as bcrypt from "bcryptjs";

// H-11: Password complexity constants
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|;':",./<>?]).{8,}$/;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto): Promise<any> {
    // H-11: Password complexity enforcement
    if (!dto.password || dto.password.length < PASSWORD_MIN_LENGTH) {
      throw new BadRequestException(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
    }
    if (!PASSWORD_REGEX.test(dto.password)) {
      throw new BadRequestException(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    const existing = await this.usersService.findOneByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`User with email '${dto.email}' already exists`);
    }

    // Default registration assigns CUSTOMER role
    const customerRole = await this.prisma.role.findUnique({
      where: { name: SystemRole.CUSTOMER },
    });

    const roleNames = customerRole ? [SystemRole.CUSTOMER] : [];

    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleNames,
    });

    return this.sanitizeUser(user);
  }

  // M-11 FIX: In-memory tracker for failed login attempts (should be Redis in multi-node prod)
  private failedAttempts = new Map<string, { count: number; lockedUntil: Date | null }>();

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // Check account lockout status
    const attemptRecord = this.failedAttempts.get(dto.email);
    if (attemptRecord && attemptRecord.lockedUntil) {
      if (new Date() < attemptRecord.lockedUntil) {
        throw new UnauthorizedException(
          "Account temporarily locked due to multiple failed login attempts. Please try again later.",
        );
      } else {
        // Lock expired, reset
        this.failedAttempts.delete(dto.email);
      }
    }

    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      this.recordFailedAttempt(dto.email);
      throw new UnauthorizedException("Invalid user credentials");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user!.password);
    if (!isPasswordValid) {
      this.recordFailedAttempt(dto.email);
      throw new UnauthorizedException("Invalid user credentials");
    }

    // Successful login — reset failed attempts
    this.failedAttempts.delete(dto.email);

    if (!user!.isActive) {
      throw new UnauthorizedException("Your account is currently suspended");
    }

    // Create secure sessions & tokens
    const primaryRole = user!.userRoles?.[0]?.roles?.name || SystemRole.CUSTOMER;
    const permissions =
      user!.userRoles?.flatMap(
        (ur) => ur.roles?.rolePermissions?.map((p) => p.permissions?.action) || [],
      ) || [];

    const tenantId = (user as any).shopUsers?.[0]?.shops?.tenantId || null;

    const payload: JwtPayload = {
      sub: user!.id,
      email: user!.email,
      role: primaryRole,
      permissions,
      tenantId,
    };

    const accessSecret = this.configService.get<string>("auth.jwtSecret");
    const refreshSecret = this.configService.get<string>("auth.jwtRefreshSecret") || accessSecret;
    const accessToken = await this.jwtService.signAsync(payload, { secret: accessSecret });

    // C-02 FIX: Refresh Token uses SEPARATE secret for security isolation
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: this.configService.get<string>("auth.jwtRefreshExpiresIn") || "7d",
    });

    // Save session in database for audit telemetry & token rotation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.session.create({
      data: {
        userId: user!.id,
        refreshToken,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  private recordFailedAttempt(email: string) {
    const record = this.failedAttempts.get(email) || { count: 0, lockedUntil: null };
    record.count += 1;
    
    // Lock after 5 failed attempts for 15 minutes
    if (record.count >= 5) {
      const lockTime = new Date();
      lockTime.setMinutes(lockTime.getMinutes() + 15);
      record.lockedUntil = lockTime;
    }
    
    this.failedAttempts.set(email, record);
  }

  async refresh(
    token: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Pick<AuthResponse, "accessToken" | "refreshToken">> {
    try {
      // C-02 FIX: Verify refresh token with dedicated refresh secret
      const refreshSecret = this.configService.get<string>("auth.jwtRefreshSecret") || this.configService.get<string>("auth.jwtSecret");
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: refreshSecret,
        algorithms: ["HS256"],
      });

      // Find token in active session mapping
      const session = await this.prisma.session.findUnique({
        where: { refreshToken: token },
      });

      if (!session || session.isRevoked || session.expiresAt < new Date()) {
        if (session && !session.isRevoked) {
          // Replay attack prevention: Revoke all sessions for this compromised user!
          await this.prisma.session.updateMany({
            where: { userId: payload.sub },
            data: { isRevoked: true },
          });
        }
        throw new UnauthorizedException("Invalid or expired session credentials");
      }

      // Perform Refresh Token Rotation (RTR): Revoke previous token
      await this.prisma.session.update({
        where: { id: session.id },
        data: { isRevoked: true },
      });

      // Query fresh user details to check active status and updated permissions
      const user = await this.usersService.findOneById(payload.sub);
      if (!user || !user!.isActive) {
        throw new UnauthorizedException("User session is no longer active");
      }

      const primaryRole = user!.userRoles?.[0]?.roles?.name || SystemRole.CUSTOMER;
      const permissions =
        user!.userRoles?.flatMap(
          (ur) => ur.roles?.rolePermissions?.map((p) => p.permissions?.action) || [],
        ) || [];

      const tenantId = (user as any).shopUsers?.[0]?.shops?.tenantId || null;

      const newPayload: JwtPayload = {
        sub: user!.id,
        email: user!.email,
        role: primaryRole,
        permissions,
        tenantId,
      };

      const accessSecret = this.configService.get<string>("auth.jwtSecret");
      const accessToken = await this.jwtService.signAsync(newPayload, { secret: accessSecret });
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        secret: refreshSecret,
        expiresIn: this.configService.get<string>("auth.jwtRefreshExpiresIn") || "7d",
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Save new session mapping
      await this.prisma.session.create({
        data: {
          userId: user!.id,
          refreshToken: newRefreshToken,
          ipAddress,
          userAgent,
          expiresAt,
        },
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err: unknown) {
      throw new UnauthorizedException(
        ((err as any)?.message as string) || "Invalid session credentials",
      );
    }
  }

  async logout(token: string): Promise<void> {
    try {
      await this.prisma.session.update({
        where: { refreshToken: token },
        data: { isRevoked: true },
      });
    } catch {
      // Fail silently for security mapping
    }
  }

  async me(userId: string) {
    const user = await this.usersService.findOneById(userId);
    return this.sanitizeUser(user);
  }

  // M-02 FIX: Type-safe sanitization with proper null guards
  private sanitizeUser(u: unknown): any {
    if (!u || typeof u !== 'object') return {};
    const user = u as Record<string, any>;
    const primaryRole = user.userRoles?.[0]?.roles;

    const safeDate = (d: unknown): string | null => {
      if (!d) return null;
      return d instanceof Date ? d.toISOString() : String(d);
    };

    const mapPermission = (p: Record<string, any>) => ({
      id: p?.permissions?.id ?? null,
      action: p?.permissions?.action ?? null,
      description: p?.permissions?.description ?? null,
      createdAt: safeDate(p?.permissions?.createdAt),
    });

    const mapRole = (role: Record<string, any> | undefined) => {
      if (!role) return undefined;
      return {
        id: role.id,
        name: role.name,
        description: role.description ?? null,
        createdAt: safeDate(role.createdAt),
        updatedAt: safeDate(role.updatedAt),
        permissions: Array.isArray(role.rolePermissions)
          ? role.rolePermissions.map(mapPermission)
          : [],
      };
    };

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      isActive: user.isActive ?? false,
      roleId: primaryRole?.id || "",
      createdAt: safeDate(user.createdAt),
      updatedAt: safeDate(user.updatedAt),
      deletedAt: safeDate(user.deletedAt),
      role: mapRole(primaryRole),
      roles: Array.isArray(user.userRoles)
        ? user.userRoles.map((ur: Record<string, any>) => mapRole(ur.roles))
        : [],
    };
  }
}
