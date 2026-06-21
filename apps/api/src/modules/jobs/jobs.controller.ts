import { Controller, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { AuthGuard } from "@common/guards/auth.guard";

@Controller("jobs")
@UseGuards(AuthGuard)
export class JobsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async getJobs() {
    return this.prisma.backgroundJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }
}
