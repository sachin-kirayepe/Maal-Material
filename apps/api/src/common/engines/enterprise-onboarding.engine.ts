import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseOnboardingEngine — "The Guided Setup Fabric" (Phase 8B)
 *
 * A state machine governing a new organization's journey from sign-up
 * to a fully activated, operating node within Maal-Material.
 */
@Injectable()
export class EnterpriseOnboardingEngine {
  private readonly logger = new Logger(EnterpriseOnboardingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a new tenant's onboarding profile.
   */
  async initializeOnboarding(tenantId: string): Promise<any> {
    this.logger.log(`Initializing Enterprise Onboarding for Tenant [${tenantId}]`);

    return this.prisma.enterpriseOnboardingProfile.create({
      data: {
        tenantId,
        onboardingState: "NEW",
        completedChecklists: JSON.stringify({
          organization_created: true,
          billing_configured: false,
          first_admin_invited: false,
          digital_twin_imported: false,
        }),
      },
    });
  }

  /**
   * Completes an onboarding milestone, unlocking subsequent platform features.
   */
  async markMilestoneComplete(tenantId: string, milestoneKey: string) {
    this.logger.log(
      `Onboarding: Marking milestone [${milestoneKey}] complete for Tenant [${tenantId}]`,
    );

    const profile = await this.prisma.enterpriseOnboardingProfile.findUnique({
      where: { tenantId },
    });

    if (!profile) return;

    const checklists = JSON.parse(profile.completedChecklists as string);
    checklists[milestoneKey] = true;

    // Evaluate state progression
    const allCoreDone = checklists["billing_configured"] && checklists["first_admin_invited"];
    const newState = allCoreDone ? "ACTIVATED" : "IN_PROGRESS";

    await this.prisma.enterpriseOnboardingProfile.update({
      where: { tenantId },
      data: {
        completedChecklists: JSON.stringify(checklists),
        onboardingState: newState,
      },
    });

    if (newState === "ACTIVATED") {
      this.logger.log(
        `Enterprise Onboarding fully complete for Tenant [${tenantId}]. Unlock full access.`,
      );
    }
  }
}
