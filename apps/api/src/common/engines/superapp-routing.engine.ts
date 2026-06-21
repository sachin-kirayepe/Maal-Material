import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SuperappRoutingEngine
 *
 * Determines whether a requested workflow should be handled by the core platform
 * or delegated to an activated MiniAppModule. This provides the foundation for
 * embedded mini-apps and the future developer ecosystem.
 */
@Injectable()
export class SuperappRoutingEngine {
  private readonly logger = new Logger(SuperappRoutingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves whether a specific app/module is activated for a tenant!.
   * Returns the module config if active, or null if the tenant hasn't enabled it.
   */
  async resolveModule(tenantId: string, appName: string) {
    const module = await this.prisma.miniAppModule.findUnique({
      where: { tenantId_appName: { tenantId, appName } },
    });

    if (!module || !module.isActive) {
      this.logger.debug(`MiniApp ${appName} is not active for tenant ${tenantId}`);
      return null;
    }

    return {
      appName: module.appName,
      appVersion: module.appVersion,
      entryUrl: module.entryUrl,
      config: module.configPayload ? JSON.parse(module.configPayload) : {},
    };
  }

  /**
   * Lists all activated mini-app modules for a tenant!.
   * Useful for rendering the superapp navigation shell.
   */
  async getActivatedModules(tenantId: string) {
    const modules = await this.prisma.miniAppModule.findMany({
      where: { tenantId, isActive: true },
    });

    return modules.map((m) => ({
      appName: m.appName,
      appVersion: m.appVersion,
      entryUrl: m.entryUrl,
    }));
  }

  /**
   * Activates or deactivates a mini-app module for a tenant!.
   */
  async toggleModule(tenantId: string, appName: string, isActive: boolean) {
    this.logger.log(
      `${isActive ? "Activating" : "Deactivating"} MiniApp ${appName} for tenant ${tenantId}`,
    );

    return this.prisma.miniAppModule.upsert({
      where: { tenantId_appName: { tenantId, appName } },
      update: { isActive },
      create: {
        tenantId,
        appName,
        isActive,
      },
    });
  }
}
