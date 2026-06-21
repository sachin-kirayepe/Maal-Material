import { Module } from "@nestjs/common";
import { SmbOnboardingService } from "./smb-onboarding.service";
import { SmbOnboardingController } from "./smb-onboarding.controller";

@Module({
  providers: [SmbOnboardingService],
  controllers: [SmbOnboardingController],
})
export class SmbOnboardingModule {}
