import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PluginLifecycleEngine
 *
 * Manages the installation, configuration, and safe removal of 3rd party plugins.
 * Ensures that tenants can adopt extensions without risking platform stability.
 */
@Injectable()
export class PluginLifecycleEngine {
  private readonly logger = new Logger(PluginLifecycleEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Installs a plugin into a tenant's workspace securely.
   */
  async installPlugin(tenantId: string, pluginKey: string, version: string, configJson: unknown) {
    this.logger.log(`Installing Plugin [${pluginKey}] v${version} for Tenant [${tenantId}]`);

    const plugin = await this.prisma.industrialAppPlugin.upsert({
      where: {
        unique_tenant_plugin: { tenantId, pluginKey },
      },
      update: { version, status: "ACTIVE", configurationJson: JSON.stringify(configJson) },
      create: {
        tenantId,
        pluginKey,
        version,
        status: "ACTIVE",
        configurationJson: JSON.stringify(configJson),
      },
    });

    await this.prisma.pluginLifecycleEvent.create({
      data: {
        tenantId,
        pluginKey,
        eventType: "INSTALLED",
        detailsJson: JSON.stringify({ version, installedAt: new Date().toISOString() }),
      },
    });

    return plugin;
  }

  /**
   * Gracefully disables a plugin if it is crashing or misbehaving.
   */
  async disablePlugin(tenantId: string, pluginKey: string, reason: string) {
    this.logger.warn(`Disabling Plugin [${pluginKey}] for Tenant [${tenantId}]. Reason: ${reason}`);

    await this.prisma.industrialAppPlugin.update({
      where: { unique_tenant_plugin: { tenantId, pluginKey } },
      data: { status: "DISABLED" },
    });

    await this.prisma.pluginLifecycleEvent.create({
      data: {
        tenantId,
        pluginKey,
        eventType: "DISABLED_DUE_TO_ERROR",
        detailsJson: JSON.stringify({ reason }),
      },
    });
  }
}
