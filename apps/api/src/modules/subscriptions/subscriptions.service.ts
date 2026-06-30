import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { GatewayService } from '../payments/gateway.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: GatewayService,
  ) {}

  async subscribeTenant(tenantId: string, planName: string) {
    const plan = await this.prisma.saaSSubscriptionPlan.findFirst({
      where: { planCode: planName }
    });

    if (!plan) throw new NotFoundException('Plan not found');

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) throw new NotFoundException('Tenant not found');

    // Create Razorpay subscription or charge them (here simulating a basic payment link logic)
    const order = await this.gateway.createOrder(plan.priceMonthly, `sub_${tenantId}`, {
      tenantId,
      planId: plan.id,
      action: 'subscribe'
    });

    return {
      message: 'Payment required to activate subscription',
      paymentDetails: order,
    };
  }

  async activateSubscription(tenantId: string, planId: string) {
    const plan = await this.prisma.saaSSubscriptionPlan.findUnique({
      where: { id: planId }
    });

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    return this.prisma.tenantSubscription.upsert({
      where: { tenantId },
      update: {
        planName: plan ? plan.planCode : 'FREE',
        status: 'ACTIVE',
        currentPeriodEnd: expiresAt,
      },
      create: {
        tenantId,
        planName: plan ? plan.planCode : 'FREE',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: expiresAt,
      }
    });
  }

  async getActiveSubscription(tenantId: string) {
    return this.prisma.tenantSubscription.findUnique({
      where: { tenantId }
    });
  }
}
