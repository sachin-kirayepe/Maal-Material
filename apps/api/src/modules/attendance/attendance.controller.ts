import { Controller, Get, Post, Body, Query, Param, UseGuards, Request } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { MarkAttendanceDto, BulkAttendanceDto, AttendanceQueryDto } from "./dto/attendance.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  markAttendance(@Body() dto: MarkAttendanceDto, @Request() req: unknown) {
    return this.attendanceService.markAttendance(
      dto,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }

  @Post("bulk")
  markBulkAttendance(@Body() dto: BulkAttendanceDto, @Request() req: unknown) {
    return this.attendanceService.markBulkAttendance(
      dto,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }

  @Get()
  findAll(@Query() query: AttendanceQueryDto) {
    return this.attendanceService.findAll(query);
  }

  @Get("site/:siteId/daily/:date")
  getSiteDailySummary(@Param("siteId") siteId: string, @Param("date") date: string) {
    return this.attendanceService.getSiteDailySummary(siteId, date);
  }
}
