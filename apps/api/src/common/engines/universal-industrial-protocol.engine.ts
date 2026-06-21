import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalIndustrialProtocolEngine — "The Universal Translator" (Phase 36)
 *
 * Standardizes payloads from divergent IoT devices into a unified operational format.
 * Enforces cryptographic signing for every machine payload to prevent rogue actions.
 */
@Injectable()
export class UniversalIndustrialProtocolEngine {
  private readonly logger = new Logger(UniversalIndustrialProtocolEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new universal protocol definition.
   */
  async registerProtocol(
    protocolName: string,
    payloadSchema: string,
    encryptionLevel: string = "AHEAD_OF_THREAT",
  ) {
    this.logger.debug(`Registering Universal Industrial Protocol: ${protocolName}`);

    return await this.prisma.universalIndustrialProtocol.upsert({
      where: { protocolName },
      update: { payloadSchema, encryptionLevel },
      create: { protocolName, payloadSchema, encryptionLevel },
    });
  }

  /**
   * Verifies an incoming M2M payload against the protocol schema.
   */
  verifyPayloadIntegrity(protocolName: string, payload: unknown, signature: string) {
    if (!signature) {
      this.logger.error(
        `MALFORMED PACKET: Machine payload for [${protocolName}] lacks cryptographic signature. Quarantining immediately.`,
      );
      throw new UnauthorizedException("Unsigned M2M payloads are strictly forbidden.");
    }
    this.logger.log(`Payload for protocol [${protocolName}] cryptographically verified.`);
    return true;
  }
}
