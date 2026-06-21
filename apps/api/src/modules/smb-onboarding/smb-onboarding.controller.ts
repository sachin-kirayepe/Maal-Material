import { Controller, Post, Body, Put, Param } from "@nestjs/common";
import { SmbOnboardingService } from "./smb-onboarding.service";

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
