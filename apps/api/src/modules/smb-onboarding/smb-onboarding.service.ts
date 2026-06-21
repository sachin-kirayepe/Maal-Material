import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class SmbOnboardingService {
  private readonly logger = new Logger(SmbOnboardingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes or fetches the onboarding profile for an SMB.
   */
  async initializeOnboarding(tenantId: string, shopId: string, businessCategory: string) {
    this.logger.log(`Initializing onboarding for Shop: ${shopId} as ${businessCategory}`);

    // Create Profile if not exists
    let profile = await this.prisma.shopProfile.findUnique({ where: { shopId } });
    if (!profile) {
      profile = await this.prisma.shopProfile.create({
        data: {
          shopId,
          primaryLanguage: "hi", // Hindi default for SMB
          defaultBillingUnit: businessCategory === "CEMENT" ? "BAGS" : "PCS",
        },
      });
    }

    let onboarding = await this.prisma.sMBOnboarding.findUnique({ where: { shopId } });
    if (!onboarding) {
      onboarding = await this.prisma.sMBOnboarding.create({
        data: {
          shopId,
          businessCategory,
          currentStep: 1,
        },
      });

      // Automatically generate simplified presets for this business category
      await this.generateWorkflowPresets(shopId, businessCategory);
    }

    return { onboarding, profile };
  }

  private async generateWorkflowPresets(shopId: string, category: string) {
    // Generate default quick actions based on category
    const actions = [];
    if (category === "HARDWARE") {
      actions.push({ shopId, actionType: "QUICK_BILL", label: "Naya Bill Banaye" });
      actions.push({ shopId, actionType: "ADD_UDHARI", label: "Udhari Jama Kare" });
    } else if (category === "PAINT") {
      actions.push({ shopId, actionType: "QUICK_MIX", label: "Paint Mix Record Kare" });
      actions.push({ shopId, actionType: "QUICK_BILL", label: "Naya Bill Banaye" });
    }

    for (const action of actions) {
      // In a real app we'd need tenantId from the shop relation, assuming generic string for now in this mock step
      const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
      if (shop) {
        await this.prisma.quickAction.create({
          data: {
            tenantId: shop.tenantId,
            shopId: action.shopId,
            actionType: action.actionType,
            label: action.label,
          },
        });
      }
    }
  }

  async completeStep(shopId: string, stepNumber: number) {
    return await this.prisma.sMBOnboarding.update({
      where: { shopId },
      data: { currentStep: stepNumber + 1 },
    });
  }
}
