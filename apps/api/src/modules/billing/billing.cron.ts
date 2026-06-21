import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class BillingCronService {
  private readonly logger = new Logger(BillingCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionExpirations() {
    this.logger.log('Starting daily subscription expiration check...');

    const expiredSubscriptions = await this.prisma.tenantSubscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: {
          lt: new Date()
        }
      }
    });

    for (const sub of expiredSubscriptions) {
      await this.prisma.tenantSubscription.update({
        where: { id: sub.id },
        data: { status: 'PAST_DUE' }
      });
      this.logger.log(`Subscription ${sub.id} marked as PAST_DUE`);
      
      // Here we would normally trigger Razorpay auto-debit or send an email invoice
    }

    this.logger.log('Subscription expiration check completed.');
  }
}
