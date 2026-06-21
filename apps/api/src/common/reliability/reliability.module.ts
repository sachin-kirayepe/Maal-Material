import { Module, Global } from "@nestjs/common";
import { CircuitBreakerService } from "./circuit-breaker.service";
import { RetryOrchestratorService } from "./retry-orchestrator.service";
import { IdempotencyGuardService } from "./idempotency-guard.service";
import { SystemDiagnosticsEngine } from "./system-diagnostics.engine";
import { PrismaModule } from "../../database/prisma.module";

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    CircuitBreakerService,
    RetryOrchestratorService,
    IdempotencyGuardService,
    SystemDiagnosticsEngine,
  ],
  exports: [
    CircuitBreakerService,
    RetryOrchestratorService,
    IdempotencyGuardService,
    SystemDiagnosticsEngine,
  ],
})
export class ReliabilityModule {}
