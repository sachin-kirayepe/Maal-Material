import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] || request.query.tenantId;

    if (!tenantId) {
      throw new ForbiddenException('Tenant ID is required to verify subscription access');
    }

    const subscription = await this.prisma.tenantSubscription.findFirst({
      where: {
        tenantId,
        status: 'ACTIVE',
        currentPeriodEnd: { gte: new Date() }
      }
    });

    if (!subscription) {
      throw new ForbiddenException('Your subscription is inactive or expired. Please upgrade your plan to access this feature.');
    }

    return true;
  }
}
