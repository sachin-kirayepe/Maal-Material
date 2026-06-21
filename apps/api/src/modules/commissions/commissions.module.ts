import { Module } from '@nestjs/common';
import { CommissionsService } from './commissions.service';
import { PrismaModule } from '@database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommissionsService],
  exports: [CommissionsService]
})
export class CommissionsModule {}
