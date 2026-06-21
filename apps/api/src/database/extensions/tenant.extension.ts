import { Prisma } from "@prisma/client";
import { TenantContext } from "../../common/context/tenant-context";
import { ForbiddenException, Logger } from "@nestjs/common";

const logger = new Logger("ZeroTrustPrismaExtension");

/**
 * Zero-Trust ORM Extension for Prisma.
 * Mathematically guarantees that every query executed against the database
 * automatically inherits the `tenantId` from the Node.js execution context (ALS).
 * It intercepts all models and all operations, mutating the `where` clause to inject
 * the secure tenant scope.
 */
export const tenantExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
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

          const createOperations = ["create", "createMany"];

          // System tables or global tables that do not have tenantId
          // (Modify this array if you have global lookup tables)
          const globalModels = ["User", "Role", "SystemConfig", "ProtocolTelemetrics"];

          if (globalModels.includes(model)) {
            return query(args); // Skip isolation for strictly global models
          }

          const context = TenantContext.getStore();
          const secureTenantId = context?.tenantId;

          if (
            (readWriteOperations.includes(operation) || createOperations.includes(operation)) &&
            !secureTenantId
          ) {
            // Fail Closed: If no context exists, we reject the query completely.
            logger.error(
              `Zero-Trust Violation: Attempted to query ${model} without an active TenantContext.`,
            );
            throw new ForbiddenException(
              `System Architecture Violation: Attempted to execute ${operation} on ${model} without an active Tenant Context.`,
            );
          }

          if (readWriteOperations.includes(operation)) {
            // Forcefully inject the tenant scope into the where clause
            if (args) {
              (args as any).where = {
                ...((args as any).where || {}),
                tenantId: secureTenantId,
              };
            } else {
              (args as any) = { where: { tenantId: secureTenantId } };
            }
          } else if (createOperations.includes(operation)) {
            // Forcefully inject the tenant scope into the data payload
            if (args) {
              if (operation === "createMany" && Array.isArray((args as any).data)) {
                (args as any).data = (args as any).data.map((item: any) => ({
                  ...item,
                  tenantId: secureTenantId,
                }));
              } else {
                (args as any).data = {
                  ...((args as any).data || {}),
                  tenantId: secureTenantId,
                };
              }
            } else {
              (args as any) = { data: { tenantId: secureTenantId } };
            }
          }

          // Execute the mutated, mathematically safe query
          return query(args);
        },
      },
    },
  });
});
