import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { DomainOntologyEngine } from "./domain-ontology.engine";

/**
 * UniversalEntityEngine
 *
 * Provides an industry-agnostic abstraction for business entities.
 * Instead of explicitly querying "Contractors" or "Hospitals", systems interact
 * with Universal Commerce Entities, governed by dynamic JSON attributes.
 */
@Injectable()
export class UniversalEntityEngine {
  private readonly logger = new Logger(UniversalEntityEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ontologyEngine: DomainOntologyEngine,
  ) {}

  /**
   * Creates a new Universal Entity (e.g. A specialized Vendor)
   * after validating its dynamic payload against the Industry Ontology.
   */
  async createUniversalEntity(
    tenantId: string,
    industryDomain: string,
    entityType: string,
    payload: unknown,
  ) {
    this.logger.debug(`Creating Universal Entity [${entityType}] for Domain: ${industryDomain}`);

    // Validate the dynamic payload against the schema definition
    const isValid = await this.ontologyEngine.validateAgainstSchema(
      tenantId,
      industryDomain,
      entityType,
      payload,
    );

    if (!isValid) {
      throw new Error(`Payload does not conform to the ${industryDomain} ${entityType} ontology.`);
    }

    return this.prisma.universalCommerceEntity.create({
      data: {
        tenantId,
        entityType,
        industryDomain,
        attributesJson: JSON.stringify(payload),
        isActive: true,
      },
    });
  }

  /**
   * Retrieves entities across industries based on universal traits.
   */
  async findEntitiesByTrait(tenantId: string, entityType: string) {
    return this.prisma.universalCommerceEntity.findMany({
      where: { tenantId, entityType, isActive: true },
    });
  }
}
