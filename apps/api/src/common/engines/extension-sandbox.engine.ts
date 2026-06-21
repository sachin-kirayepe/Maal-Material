import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ExtensionSandboxEngine
 *
 * Implements a strict Zero-Trust security boundary for 3rd party plugins.
 * Before an SDK function executes, this engine validates that the plugin
 * has been explicitly granted access by the tenant admin.
 */
@Injectable()
export class ExtensionSandboxEngine {
  private readonly logger = new Logger(ExtensionSandboxEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates whether a specific plugin is allowed to access a specific resource.
   */
  async authorizePluginAction(
    tenantId: string,
    pluginKey: string,
    resourceType: string,
    requestedAccessLevel: string,
  ): Promise<boolean> {
    this.logger.debug(
      `Validating Sandbox Policy for Plugin [${pluginKey}] on Resource [${resourceType}] for Access [${requestedAccessLevel}]`,
    );

    // Verify plugin is actually ACTIVE
    const plugin = await this.prisma.industrialAppPlugin.findUnique({
      where: { unique_tenant_plugin: { tenantId, pluginKey } },
    });

    if (!plugin || plugin.status !== "ACTIVE") {
      this.logger.warn(`Plugin ${pluginKey} is not active or not installed.`);
      return false;
    }

    // Verify explicit policy grant
    const policy = await this.prisma.extensionSandboxPolicy.findFirst({
      where: { tenantId, pluginKey, resourceType },
    });

    if (!policy) {
      this.logger.warn(`ZERO TRUST BLOCK: Plugin ${pluginKey} lacks policy for ${resourceType}.`);
      return false;
    }

    if (policy.accessLevel === "DENY") {
      return false;
    }

    if (requestedAccessLevel === "WRITE" && policy.accessLevel === "READ") {
      this.logger.warn(
        `PERMISSION DENIED: Plugin ${pluginKey} attempted WRITE, but only has READ on ${resourceType}.`,
      );
      return false;
    }

    this.logger.debug(`Sandbox Execution Allowed.`);
    return true;
  }
}
