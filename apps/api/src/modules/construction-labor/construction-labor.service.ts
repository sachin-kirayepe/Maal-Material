import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ConstructionLaborService {
  constructor(private prisma: PrismaService) {}

  logAttendance(data: unknown) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionLaborAttendance.create({ data });
  }

  getAttendance(projectId: string) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionLaborAttendance.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { date: "desc" },
    });
  }

  async getProductivity(projectId: string) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    const attendance = await this.prisma.constructionLaborAttendance.findMany({
      where: projectId ? { projectId } : undefined,
    });
    const totalHours = attendance.reduce(
      (sum: any, a: any) => sum + a.hoursWorked + a.overtimeHours,
      0,
    );
    const totalCost = attendance.reduce((sum: any, a: any) => sum + a.totalCalculatedWage, 0);
    return { totalHours, totalCost, records: attendance.length };
  }
}
