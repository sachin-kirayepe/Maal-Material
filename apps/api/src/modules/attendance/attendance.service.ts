import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { MarkAttendanceDto, BulkAttendanceDto, AttendanceQueryDto } from "./dto/attendance.dto";
import { EventsService } from "../events/events.service";
import { DomainEvents } from "../events/dto/events.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

/** Shift multipliers for wage calculation */
const SHIFT_MULTIPLIERS: Record<string, number> = {
  FULL_DAY: 1.0,
  HALF_DAY: 0.5,
  OVERTIME: 1.5,
  NIGHT_SHIFT: 1.25,
};

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService, private readonly realtimeGateway: RealtimeGateway
  ) {}

  /**
   * Mark attendance for a single worker â€” this is a transaction-safe operation
   * that simultaneously:
   * 1. Records attendance
   * 2. Calculates wage based on shift type
   * 3. Creates a LABOR ProjectExpense entry
   * 4. Increments ProjectCosting.laborCost
   */
  async markAttendance(dto: MarkAttendanceDto, userId: string) {

                try {
                  // Validate worker and site exist
      const [worker, site] = await Promise.all([
        this.prisma.ecosystemWorkforce.findUnique({ where: { id: dto.workerId } }),
        this.prisma.projectSite.findUnique({
          where: { id: dto.siteId },
          include: { projects: { select: { id: true } } },
        }),
      ]);

      if (!worker) throw new NotFoundException(`Worker ${dto.workerId} not found`);
      if (!site) throw new NotFoundException(`Site ${dto.siteId} not found`);

      const shiftType = dto.shiftType || "FULL_DAY";
      const status = dto.status || "PRESENT";
      const multiplier =
        status === "ABSENT" || status === "LEAVE" ? 0 : SHIFT_MULTIPLIERS[shiftType] || 1;
      const wageAmount = Math.round(worker.dailyWage * multiplier * 100) / 100;
      const overtimeRate = (worker.dailyWage / 8) * 1.5; // 1.5x hourly rate for overtime
      const overtimeAmount = (dto.overtimeHours || 0) * overtimeRate;
      const totalWage = wageAmount + Math.round(overtimeAmount * 100) / 100;

      const result = await this.prisma.$transaction(async (tx) => {
        // 1. Create or update attendance record
        const attendance = await tx.workforceAttendance.upsert({
          where: {
            workerId_siteId_date: {
              workerId: dto.workerId,
              siteId: dto.siteId,
              date: new Date(dto.date),
            },
          },
          create: {
            workerId: dto.workerId,
            siteId: dto.siteId,
            date: new Date(dto.date),
            shiftType,
            hoursWorked: dto.hoursWorked || 8,
            dailyWage: worker.dailyWage,
            wageAmount: totalWage,
            overtimeHours: dto.overtimeHours || 0,
            overtimeRate,
            status,
            markedBy: userId,
            notes: dto.notes,
          },
          update: {
            shiftType,
            hoursWorked: dto.hoursWorked || 8,
            dailyWage: worker.dailyWage,
            wageAmount: totalWage,
            overtimeHours: dto.overtimeHours || 0,
            overtimeRate,
            status,
            markedBy: userId,
            notes: dto.notes,
          },
        });

        // 2. If worker was present, create a labor expense and update costing
        if (status !== "ABSENT" && status !== "LEAVE" && totalWage > 0) {
          await tx.projectExpense.create({
            data: {
              projectId: site.projectId,
              siteId: site.id,
              expenseType: "LABOR",
              description: `Wage: ${worker.name} (${worker.skillType}) - ${shiftType}`,
              amount: totalWage,
              referenceType: "ATTENDANCE",
              referenceId: attendance.id,
              expenseDate: new Date(dto.date),
              recordedBy: userId,
              status: "APPROVED", // Auto-approve attendance-based expenses
            },
          });

          // 3. Increment the project costing labor bucket
          await tx.projectCosting.upsert({
            where: { projectId: site.projectId },
            create: {
              projectId: site.projectId,
              laborCost: totalWage,
              totalCost: totalWage,
            },
            update: {
              laborCost: { increment: totalWage },
              totalCost: { increment: totalWage },
              lastCalculatedAt: new Date(),
            },
          });

          // 4. Update project actual cost
          await tx.project.update({
            where: { id: site.projectId },
            data: { actualCost: { increment: totalWage } },
          });
        }

        return attendance;
      });

      if (result.status !== "ABSENT" && result.status !== "LEAVE" && totalWage > 0) {
        this.eventsService.publish(DomainEvents.LABOR_ACCRUED, {
          tenantId: site.tenantId,
          userId,
          projectId: site.projectId,
          siteId: site.id,
          workerId: worker.id,
          wageAmount: totalWage,
        });
      }

      return result;
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'AttendanceService', 
                         action: 'markAttendance',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Bulk attendance marking â€” processes each entry through the same
   * transaction-safe pipeline
   */
  async markBulkAttendance(dto: BulkAttendanceDto, userId: string) {

                try {
                  const results = [];
      for (const entry of dto.entries) {
        const result = await this.markAttendance(entry, userId);
        results.push(result);
      }
      return { marked: results.length, entries: results };
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'AttendanceService', 
                         action: 'markBulkAttendance',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Query attendance records
   */
  async findAll(query: AttendanceQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: unknown = {};
    if (query.siteId) (where as any).siteId = query.siteId;
    if (query.workerId) (where as any).workerId = query.workerId;
    if (query.status) (where as any).status = query.status;
    if (query.dateFrom || query.dateTo) {
      (where as any).date = {};
      if (query.dateFrom) (where as any).date.gte = new Date(query.dateFrom);
      if (query.dateTo) (where as any).date.lte = new Date(query.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.workforceAttendance.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          workers: { select: { name: true, mobile: true, skillType: true } },
          projectSites: { select: { name: true, siteCode: true } },
        },
      }),
      this.prisma.workforceAttendance.count({ where: where as any }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get attendance summary for a site on a given date
   */
  async getSiteDailySummary(siteId: string, date: string) {
    const attendances = await this.prisma.workforceAttendance.findMany({
      where: {
        siteId,
        date: new Date(date),
      },
      include: {
        workers: { select: { name: true, skillType: true, dailyWage: true } },
      },
    });

    const present = attendances.filter((a) => a.status === "PRESENT").length;
    const absent = attendances.filter((a) => a.status === "ABSENT").length;
    const halfDay = attendances.filter((a) => a.status === "HALF_DAY").length;
    const totalWages = attendances.reduce((sum, a) => sum + a.wageAmount, 0);

    return {
      date,
      siteId,
      totalWorkers: attendances.length,
      present,
      absent,
      halfDay,
      totalWages: Math.round(totalWages * 100) / 100,
      attendances,
    };
  }
}
