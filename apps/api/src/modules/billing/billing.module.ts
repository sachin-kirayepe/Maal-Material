import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BillingCronService } from './billing.cron';
import { PrismaModule } from '@database/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [BillingCronService],
})
export class BillingModule {}
