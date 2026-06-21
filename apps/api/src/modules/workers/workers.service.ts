import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateWorkerDto, UpdateWorkerDto, WorkerQueryDto } from "./dto/worker.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Register a new worker
   */
  async create(dto: CreateWorkerDto) {

                try {
                  // Check for duplicate mobile
      const existing = await this.prisma.ecosystemWorkforce.findUnique({
        where: { mobile: dto.mobile },
      });
      if (existing) throw new ConflictException(`Worker with mobile ${dto.mobile} already exists`);

      return this.prisma.ecosystemWorkforce.create({
        data: {
          name: dto.name,
          mobile: dto.mobile,
          email: dto.email,
          skillType: dto.skillType || "HELPER",
          dailyWage: dto.dailyWage || 0,
          projectId: dto.projectId,
          contractorName: dto.contractorName,
          aadharNumber: dto.aadharNumber,
          bankAccount: dto.bankAccount,
          ifscCode: dto.ifscCode,
          emergencyContact: dto.emergencyContact,
          notes: dto.notes,
        },
        include: {
          projects: { select: { name: true, projectCode: true } },
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'WorkersService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * List workers with search, filters, and pagination
   */
  async findAll(query: WorkerQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: unknown = { deletedAt: null };
    if (query.projectId) (where as any).projectId = query.projectId;
    if (query.skillType) (where as any).skillType = query.skillType;
    if (query.isActive !== undefined) (where as any).isActive = query.isActive;
    if (query.search) {
      (where as any).OR = [
        { name: { contains: query.search } },
        { mobile: { contains: query.search } },
        { contractorName: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.ecosystemWorkforce.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          projects: { select: { name: true, projectCode: true } },
          _count: { select: {} },
        },
      }),
      this.prisma.ecosystemWorkforce.count({ where: where as any }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get worker by ID
   */
  async findById(id: string) {
    const worker = await this.prisma.ecosystemWorkforce.findUnique({
      where: { id },
      include: {
        projects: { select: { name: true, projectCode: true } },
        workerAttendances: {
          orderBy: { date: "desc" },
          take: 30,
          include: { projectSites: { select: { name: true, siteCode: true } } },
        },
      },
    });

    if (!worker) throw new NotFoundException(`Worker ${id} not found`);
    return worker;
  }

  /**
   * Update worker
   */
  async update(id: string, dto: UpdateWorkerDto) {

                try {
                  await this.findById(id);
      return this.prisma.ecosystemWorkforce.update({
        where: { id },
        data: dto,
        include: { projects: { select: { name: true, projectCode: true } } },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'WorkersService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Soft-delete worker
   */
  async remove(id: string) {
    await this.findById(id);
    return this.prisma.ecosystemWorkforce.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  /**
   * Get worker skill breakdown for analytics
   */
  async getSkillBreakdown() {
    const workers = await this.prisma.ecosystemWorkforce.groupBy({
      by: ["skillType"],
      where: { isActive: true, deletedAt: null },
      _count: { id: true },
      _avg: { dailyWage: true },
    });

    return workers.map((w) => ({
      skillType: w.skillType,
      count: w._count.id,
      avgDailyWage: Math.round((w._avg.dailyWage || 0) * 100) / 100,
    }));
  }

  // --- WORKER SELF-REGISTRATION (OTP FLOW) ---

  // In-memory cache for demo purposes. (In production, use Redis)
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();
  private verifiedTokens = new Map<string, { mobile: string; expiresAt: number }>();

  async sendOtp(mobile: string) {
    // Generate a fixed 6-digit OTP for testing (123456)
    const otp = "123456";
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
    this.otpStore.set(mobile, { otp, expiresAt });

    // Here we would normally call Twilio or Fast2SMS API.
    return { success: true, message: "OTP sent successfully" };
  }

  async verifyOtp(mobile: string, enteredOtp: string) {
    const record = this.otpStore.get(mobile);
    if (!record) throw new ConflictException("No OTP requested for this number");
    if (Date.now() > record.expiresAt) throw new ConflictException("OTP expired");
    if (record.otp !== enteredOtp) throw new ConflictException("Invalid OTP");

    // OTP is valid. Issue a temporary registration token (valid for 15 mins)
    this.otpStore.delete(mobile);
    const registerToken = Math.random().toString(36).substring(2, 15);
    this.verifiedTokens.set(registerToken, {
      mobile,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    return { success: true, token: registerToken };
  }

  async selfRegisterWorker(dto: { mobile: string; token: string; name: string; skillType: string; aadharNumber?: string }) {
    const session = this.verifiedTokens.get(dto.token);
    if (!session || session.mobile !== dto.mobile) {
      throw new ConflictException("Invalid or expired registration session. Please verify OTP again.");
    }
    if (Date.now() > session.expiresAt) {
      throw new ConflictException("Registration session expired.");
    }

    // Check if worker already exists (maybe they are just logging in)
    let worker = await this.prisma.ecosystemWorkforce.findUnique({ where: { mobile: dto.mobile } });
    
    if (worker) {
      // Update their profile if they already exist
      worker = await this.prisma.ecosystemWorkforce.update({
        where: { id: worker.id },
        data: { name: dto.name, skillType: dto.skillType, aadharNumber: dto.aadharNumber },
      });
    } else {
      // Create new worker
      worker = await this.prisma.ecosystemWorkforce.create({
        data: {
          name: dto.name,
          mobile: dto.mobile,
          skillType: dto.skillType,
          aadharNumber: dto.aadharNumber,
          dailyWage: 0,
        },
      });
    }

    // Clean up token
    this.verifiedTokens.delete(dto.token);

    return { success: true, workerId: worker.id };
  }
}
