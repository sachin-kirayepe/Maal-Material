import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { AuthGuard } from "@common/guards/auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Activity")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: "Get activity logs for current tenant" })
  getActivities(@Request() req: any) {
    return this.activityService.getActivities(req.user!.tenantId);
  }
}
