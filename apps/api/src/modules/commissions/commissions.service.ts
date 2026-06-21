import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class CommissionsService {
  private readonly logger = new Logger(CommissionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async calculatePlatformCommission(orderTotal: number, type: 'B2B' | 'RENTAL' = 'B2B'): Promise<number> {
    const configKey = type === 'B2B' ? 'B2B_COMMISSION_RATE' : 'RENTAL_COMMISSION_RATE';
    
    // Fallback to 2% if config is missing
    let rate = 2.0; 
    
    try {
      const config = await this.prisma.systemConfig.findUnique({
        where: { key: configKey }
      });
      
      if (config && config.value) {
        rate = parseFloat(config.value);
      }
    } catch (e) {
      this.logger.warn(`Could not fetch dynamic commission rate for ${type}, using fallback ${rate}%`);
    }

    const commissionAmount = (orderTotal * rate) / 100;
    return commissionAmount;
  }
}
