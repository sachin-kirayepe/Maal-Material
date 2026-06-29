import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from "@database/prisma.service";
import { createApiResponse } from "@constructos/utils";
import { Public } from "@common/decorators/is-public.decorator";

@ApiBearerAuth()
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async checkHealth() {
    let dbStatus = "healthy";
    try {
      // Execute simple query to confirm DB connectivity
      await this.prisma.$executeRaw`SELECT 1`;
    } catch (err) {
      dbStatus = "unhealthy";
    }

    const healthReport = {
      status: dbStatus === "healthy" ? "OK" : "ERROR",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        api: "healthy",
      },
    };

    return createApiResponse(
      dbStatus === "healthy",
      healthReport,
      dbStatus === "healthy" ? "System is fully operational" : "Database connection failure",
    );
  }
}
