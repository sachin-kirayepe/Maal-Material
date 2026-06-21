import { Controller, Get, Post, Param, UseGuards, Request } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { AuthGuard } from "@common/guards/auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Notifications")
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get current user notifications" })
  getUserNotifications(@Request() req: any) {
    return this.notificationsService.getUserNotifications(req.user!.id);
  }

  @Post(":id/read")
  @ApiOperation({ summary: "Mark a specific notification as read" })
  markAsRead(@Param("id") id: string, @Request() req: any) {
    return this.notificationsService.markAsRead(id, req.user!.id);
  }

  @Post("read-all")
  @ApiOperation({ summary: "Mark all notifications as read" })
  markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user!.id);
  }
}
