/**
 * Core Domain: Procurement State Machine
 * Enforces strict order lifecycle transitions.
 */

export class WorkflowError extends Error {
  constructor(message: string) {
    super(`[WORKFLOW_FAULT] ${message}`);
    this.name = "WorkflowError";
  }
}

export type OrderState =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "DISPATCHED"
  | "DELIVERED"
  | "RECONCILED"
  | "CANCELED"
  | "REJECTED";

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  state: OrderState;
  totalValue: number;
}

export class OrderStateMachine {
  /**
   * Defines the strictly allowed state transitions.
   */
  private static VALID_TRANSITIONS: Record<OrderState, OrderState[]> = {
    DRAFT: ["PENDING_APPROVAL", "CANCELED"],
    PENDING_APPROVAL: ["APPROVED", "REJECTED", "CANCELED"],
    APPROVED: ["DISPATCHED", "CANCELED"],
    DISPATCHED: ["DELIVERED"],
    DELIVERED: ["RECONCILED"],
    RECONCILED: [], // Terminal State
    CANCELED: [], // Terminal State
    REJECTED: ["DRAFT", "CANCELED"], // Can revert to draft for edits
  };

  /**
   * Attempts to transition an order to a new state.
   */
  public static transition(
    order: PurchaseOrder,
    targetState: OrderState,
    isEmergencyOverride: boolean = false,
  ): PurchaseOrder {
    const allowedTargets = this.VALID_TRANSITIONS[order.state];

    // If emergency override is flagged, allow skipping PENDING_APPROVAL -> APPROVED immediately
    // Only available for specific transitions
    if (isEmergencyOverride && order.state === "DRAFT" && targetState === "APPROVED") {
      return { ...order, state: targetState };
    }

    if (!allowedTargets.includes(targetState)) {
      throw new WorkflowError(
        `Invalid workflow transition from ${order.state} to ${targetState}. Allowed states: ${allowedTargets.join(", ") || "NONE"}`,
      );
    }

    return { ...order, state: targetState };
  }
}
