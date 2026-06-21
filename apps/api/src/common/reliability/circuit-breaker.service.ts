import { Injectable, Logger } from "@nestjs/common";

export enum CircuitState {
  CLOSED,
  OPEN,
  HALF_OPEN,
}

/**
 * CircuitBreakerService — "The Cascade Preventer" (Phase 8A)
 *
 * Implements stateful circuit breaking logic to prevent cascading failures
 * across complex multi-domain orchestration flows.
 */
@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);

  // In-memory state (in a true clustered deployment, this would be backed by Redis)
  private states = new Map<
    string,
    { state: CircuitState; failures: number; nextAttemptAt: number }
  >();

  private readonly FAILURE_THRESHOLD = 5;
  private readonly RESET_TIMEOUT_MS = 10000; // 10 seconds

  /**
   * Evaluates if a given cross-domain integration point is safe to call.
   */
  async checkExecutionSafety(integrationPoint: string): Promise<boolean> {
    const circuit = this.states.get(integrationPoint) || {
      state: CircuitState.CLOSED,
      failures: 0,
      nextAttemptAt: 0,
    };

    if (circuit.state === CircuitState.OPEN) {
      if (Date.now() > circuit.nextAttemptAt) {
        this.logger.warn(`Circuit [${integrationPoint}] transition to HALF_OPEN.`);
        circuit.state = CircuitState.HALF_OPEN;
        this.states.set(integrationPoint, circuit);
        return true;
      }
      this.logger.error(
        `Circuit [${integrationPoint}] is OPEN. Execution BLOCKED to prevent cascade.`,
      );
      return false;
    }

    return true; // CLOSED or HALF_OPEN allow execution
  }

  /**
   * Registers a successful execution, healing the circuit if half-open.
   */
  async registerSuccess(integrationPoint: string) {
    const circuit = this.states.get(integrationPoint);
    if (circuit && (circuit.state === CircuitState.HALF_OPEN || circuit.failures > 0)) {
      this.logger.log(`Circuit [${integrationPoint}] HEALED and transition to CLOSED.`);
      this.states.set(integrationPoint, {
        state: CircuitState.CLOSED,
        failures: 0,
        nextAttemptAt: 0,
      });
    }
  }

  /**
   * Registers a failure, potentially tripping the circuit to open.
   */
  async registerFailure(integrationPoint: string) {
    const circuit = this.states.get(integrationPoint) || {
      state: CircuitState.CLOSED,
      failures: 0,
      nextAttemptAt: 0,
    };

    circuit.failures += 1;

    if (circuit.state === CircuitState.HALF_OPEN || circuit.failures >= this.FAILURE_THRESHOLD) {
      this.logger.error(`Circuit [${integrationPoint}] TRIPPED to OPEN state.`);
      circuit.state = CircuitState.OPEN;
      circuit.nextAttemptAt = Date.now() + this.RESET_TIMEOUT_MS;
    }

    this.states.set(integrationPoint, circuit);
  }
}
