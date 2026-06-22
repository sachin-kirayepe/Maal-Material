import { Controller, Post, Get, Body, Req, Res, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, RefreshTokenDto } from "./dto/auth.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { CurrentUser } from "@common/decorators/current-user.decorator";
import { Public } from "@common/decorators/is-public.decorator";
import { JwtPayload } from "@constructos/types";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Platform - Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Helper to set secure cookies
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" as const : "lax" as const,
      path: "/",
    };
    
    // Access token valid for 1 day
    res.cookie("constructos_access_token", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
    // Refresh token valid for 7 days
    res.cookie("constructos_refresh_token", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }

  @Public()
  @Post("register")
  // H-10 FIX: Strict rate limit on registration — 3 attempts per 60 seconds
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: "Register a new platform user" })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return createApiResponse(true, { user: result.user }, "Registration successful");
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  // H-10 FIX: Strict rate limit on login — 5 attempts per 60 seconds to prevent brute force
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: "Sign in with business credentials" })
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const result = await this.authService.login(dto, ip, userAgent);
    
    // H-06 FIX: Set HttpOnly cookies instead of returning tokens to client JS
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return createApiResponse(true, { user: result.user }, "Login successful");
  }

  // M-12 FIX: Logout should be @Public() so users with expired tokens can still log out
  @Public()
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Revoke active session token" })
  async logout(@Body() dto: RefreshTokenDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Attempt to revoke using provided token, or extract from cookie
    let tokenToRevoke: string | undefined = dto.refreshToken;
    if (!tokenToRevoke && req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|;\s*)constructos_refresh_token=([^;]+)/);
      if (match) tokenToRevoke = match[1] as string;
    }
    
    if (tokenToRevoke) {
      await this.authService.logout(tokenToRevoke);
    }

    // Clear cookies
    res.clearCookie("constructos_access_token", { path: "/" });
    res.clearCookie("constructos_refresh_token", { path: "/" });
    
    return createApiResponse(true, null, "Logout successful");
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  // H-10 FIX: Rate limit token refresh — 10 per minute
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: "Renew expired access token using Refresh Token Rotation (RTR)" })
  async refresh(@Body() dto: RefreshTokenDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    
    let tokenToRefresh: string = dto.refreshToken as string;
    if (!tokenToRefresh && req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|;\s*)constructos_refresh_token=([^;]+)/);
      if (match) tokenToRefresh = match[1] as string;
    }

    const result = await this.authService.refresh(tokenToRefresh, ip, userAgent);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    
    return createApiResponse(true, { message: "Token refreshed successfully" });
  }

  @Get("me")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Retrieve active profile details of authenticated user" })
  async me(@CurrentUser() user: JwtPayload) {
    const result = await this.authService.me(user!.sub);
    return createApiResponse(true, result, "Profile retrieved successfully");
  }
}
