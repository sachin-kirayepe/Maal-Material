/**
 * Core Domain: Audit Logging
 * An immutable, append-only logger for tracking enterprise operations.
 */

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  userId: string;
  timestamp: string;
  action: string;
  resourceId: string;
  resourceType: string;
  diff: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    authMethod: "SESSION" | "API_KEY" | "SYSTEM_OVERRIDE";
  };
  signature: string; // Cryptographic hash of the entry payload to ensure immutability
}

export class AuditEngine {
  /**
   * Generates a tamper-evident audit log entry.
   * In a real production system, the `signature` would be generated via HMAC or stored on a WORM database.
   */
  public static async createLog(
    tenantId: string,
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    beforeState: Record<string, any>,
    afterState: Record<string, any>,
    authMethod: "SESSION" | "API_KEY" | "SYSTEM_OVERRIDE" = "SESSION",
  ): Promise<AuditLogEntry> {
    const entryId = `audit_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const payloadString = JSON.stringify({
      tenantId,
      userId,
      action,
      resourceId,
      beforeState,
      afterState,
    });

    // Simulating a cryptographic hash function for immutability
    const simulatedSignature = Buffer.from(payloadString).toString("base64").substring(0, 32);

    return {
      id: entryId,
      tenantId,
      userId,
      timestamp,
      action,
      resourceType,
      resourceId,
      diff: {
        before: beforeState,
        after: afterState,
      },
      metadata: {
        authMethod,
      },
      signature: simulatedSignature,
    };
  }

  /**
   * Validates if a log has been tampered with.
   */
  public static verifyLogIntegrity(log: AuditLogEntry): boolean {
    const payloadString = JSON.stringify({
      tenantId: log.tenantId,
      userId: log.userId,
      action: log.action,
      resourceId: log.resourceId,
      beforeState: log.diff.before,
      afterState: log.diff.after,
    });

    const calculatedSignature = Buffer.from(payloadString).toString("base64").substring(0, 32);
    return calculatedSignature === log.signature;
  }
}
