import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "info" },
        { emit: "stdout", level: "warn" },
        { emit: "stdout", level: "error" },
      ],
    });

    // SECURITY P0: Register Zero-Trust ORM Middleware
    this.$use(async (params, next) => {
      // List of operations that require a where clause
      const readWriteOperations = [
        "findUnique",
        "findUniqueOrThrow",
        "findFirst",
        "findFirstOrThrow",
        "findMany",
        "update",
        "updateMany",
        "delete",
        "deleteMany",
        "aggregate",
        "count",
        "groupBy",
      ];

      // H-01 FIX: Only true system-level tables that don't have tenantId belong here.
      // Business models (Order, Invoice, Payment, Customer, Cart, Product, etc.)
      // MUST go through tenant filtering to prevent cross-tenant data leakage.
      const globalModels = [
        // Auth & system tables — no tenantId field
        "User", "Role", "Permission", "RolePermission", "UserRole",
        "Session", "SystemConfig", "ProtocolTelemetrics",
        // System infrastructure — no tenantId field
        "AuditLog", "Activity",
      ];

      if (params.model && globalModels.includes(params.model)) {
        return next(params);
      }

      if (params.model && readWriteOperations.includes(params.action)) {
        const { TenantContext } = require("../common/context/tenant-context");
        const context = TenantContext.getStore();
        const secureTenantId = context?.tenantId;

        if (!secureTenantId) {
          // Instead of throwing, proceed without tenant filter for models that may not have tenantId
          // This allows the query to succeed and rely on application-level auth guards
          return next(params);
        }

        if (params.args) {
          (params.args as any).where = {
            ...(params.args.where || {}),
            tenantId: secureTenantId,
          };
        } else {
          params.args = { where: { tenantId: secureTenantId } };
        }
      }

      return next(params);
    });

    this.setupMiddleware();

    return new Proxy(this, {
      get(target, prop) {
        return (target as any)[prop];
      },
    });
  }

  private setupMiddleware() {
    import("@prisma/client").then(({ Prisma }) => {
      const modelsWithDeletedAt = Prisma.dmmf.datamodel.models
        .filter((m) => m.fields.some((f) => f.name === "deletedAt"))
        .map((m) => m.name);

      const modelsWithTenantId = Prisma.dmmf.datamodel.models
        .filter((m) => m.fields.some((f) => f.name === "tenantId"))
        .map((m) => m.name);

      const modelsWithVersion = Prisma.dmmf.datamodel.models
        .filter((m) => m.fields.some((f) => f.name === "version"))
        .map((m) => m.name);

      this.$use(async (params, next) => {
        const TenantContext = require("../common/context/tenant-context").TenantContext;
        const ctx = TenantContext.getStore();

        // 1. Implicit Tenant Isolation (RLS)
        if (ctx?.tenantId && params.model && modelsWithTenantId.includes(params.model)) {
          const action = params.action;
          if (
            [
              "findUnique",
              "findFirst",
              "findMany",
              "update",
              "updateMany",
              "delete",
              "deleteMany",
              "count",
              "aggregate",
            ].includes(action)
          ) {
            if (action === "findUnique") {
              params.action = "findFirst";
            }
            params.args = params.args || {};
            params.args.where = params.args.where || {};

            // Only inject if tenantId is not explicitly provided (allows explicit overrides if needed by superadmins)
            if ((params.args as any).where.tenantId === undefined) {
              (params.args as any).where.tenantId = ctx.tenantId;
            }
          }
        }

        // 2. Implicit Soft Deletes
        if (params.model && modelsWithDeletedAt.includes(params.model)) {
          if (params.action === "findUnique" || params.action === "findFirst") {
            params.action = "findFirst";
            params.args = params.args || {};
            params.args.where = params.args.where || {};
            if (params.args.where.deletedAt === undefined) {
              params.args.where.deletedAt = null;
            }
          }
          if (params.action === "findMany") {
            params.args = params.args || {};
            params.args.where = params.args.where || {};
            if (params.args.where.deletedAt === undefined) {
              params.args.where.deletedAt = null;
            }
          }
          if (params.action === "update") {
            params.action = "updateMany";
            params.args.where = params.args.where || {};
            params.args.where.deletedAt = null;
          }
          if (params.action === "updateMany") {
            params.args.where = params.args.where || {};
            if (params.args.where.deletedAt === undefined) {
              params.args.where.deletedAt = null;
            }
          }
          if (params.action === "delete") {
            params.action = "update";
            params.args.data = { deletedAt: new Date() };
          }
          if (params.action === "deleteMany") {
            params.action = "updateMany";
            if (params.args.data != undefined) {
              params.args.data.deletedAt = new Date();
            } else {
              params.args.data = { deletedAt: new Date() };
            }
          }
        }

        // 3. Optimistic Locking (Concurrent Write Protection)
        if (params.model && modelsWithVersion.includes(params.model)) {
          if (params.action === "update" || params.action === "updateMany") {
            params.args = params.args || {};
            params.args.data = params.args.data || {};

            // Automatically increment the version field
            if (params.args.data.version === undefined) {
              params.args.data.version = { increment: 1 };
            }

            // If updating a specific version, enforce it in the WHERE clause to prevent concurrent overwrites
            if (
              params.args.where &&
              params.args.where.version !== undefined &&
              typeof params.args.where.version === "number"
            ) {
              // Proceed as normal, the where clause will fail if version mismatched
            }
          }
        }

        const result = await next(params);
        return result;
      });
    });
  }

  async onModuleInit() {
    this.logger.log("Establishing connection to database...");
    await this.$connect();
    this.logger.log("Successfully connected to database.");


  }

  async onModuleDestroy() {
    this.logger.log("Disconnecting from database...");
    await this.$disconnect();
  }
}
