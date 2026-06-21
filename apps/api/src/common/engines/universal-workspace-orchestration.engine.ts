import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalWorkspaceOrchestrationEngine — "The App Fabric" (Phase 14)
 *
 * Handles the installation, lifecycle, and dynamic routing of modular
 * workspace apps (plugins) for a tenant's universal workspace.
 */
@Injectable()
export class UniversalWorkspaceOrchestrationEngine {
  private readonly logger = new Logger(UniversalWorkspaceOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Installs a universal app into a tenant's workspace.
   */
  async installApp(tenantId: string, appId: string, initialConfig: unknown) {
    this.logger.log(`Installing Universal Workspace App [${appId}] for Tenant [${tenantId}]`);

    const app = await this.prisma.universalWorkspaceApp.findUnique({
      where: { id: appId },
    });

    if (!app || !app.isVerified) {
      this.logger.error(`App [${appId}] is either invalid or unverified by Global Governance.`);
      throw new Error("APP_INSTALLATION_REJECTED");
    }

    const installation = await this.prisma.tenantWorkspaceInstallation.create({
      data: {
        tenantId,
        appId,
        configState: JSON.stringify(initialConfig),
        isActive: true,
      },
    });

    this.logger.debug(`App [${app.appName}] successfully installed into Tenant Workspace.`);
    return installation;
  }
}
