import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { SmbOnboardingService } from "./smb-onboarding.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("smb-onboarding")
export class SmbOnboardingController {
  constructor(private readonly smbOnboardingService: SmbOnboardingService) {}

  @Post("initialize")
  async initializeOnboarding(
    @Body() payload: { tenantId: string; shopId: string; businessCategory: string },
  ) {
    return await this.smbOnboardingService.initializeOnboarding(
      payload.tenantId,
      payload.shopId,
      payload.businessCategory,
    );
  }

  @Put(":shopId/step/:stepNumber")
  async completeStep(@Param("shopId") shopId: string, @Param("stepNumber") stepNumber: string) {
    return await this.smbOnboardingService.completeStep(shopId, parseInt(stepNumber));
  }
}
