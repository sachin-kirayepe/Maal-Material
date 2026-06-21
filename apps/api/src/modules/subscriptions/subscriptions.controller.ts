import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('subscribe')
  async subscribe(@Body() body: { tenantId: string, planName: string }) {
    return this.subscriptionsService.subscribeTenant(body.tenantId, body.planName);
  }

  @Get('active')
  async getActive(@Req() req: any) {
    // In a real app, tenantId comes from req.user
    const tenantId = req.query.tenantId; 
    return this.subscriptionsService.getActiveSubscription(tenantId);
  }
}
