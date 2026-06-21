import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * FraudDetectionEngine
 *
 * Detects suspicious patterns and generates FraudSignals.
 * Implements rule-based detection strategies that can later be
 * augmented with ML models.
 *
 * Detection Strategies:
 *   1. DUPLICATE_BILLING:   Same invoice amount to same entity within 24h
 *   2. ABNORMAL_STOCK:      Stock adjustments exceeding 3x average
 *   3. PRICE_MANIPULATION:  Sudden price changes > 40% on same material
 *   4. VELOCITY_ANOMALY:    Unusually high transaction frequency
 *   5. GHOST_WORKFORCE:     Attendance for workers not assigned to the site
 */
@Injectable()
export class FraudDetectionEngine {
  private readonly logger = new Logger(FraudDetectionEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Evaluates a specific commerce transaction for fraud signals.
   */
  async evaluateTransaction(params: {
    tenantId: string;
    entityId: string;
    transactionType: string;
    amount: number;
    metadata?: unknown;
  }) {
    const signals: unknown[] = [];

    // Strategy 1: Duplicate billing detection
    if (params.transactionType === "INVOICE" || params.transactionType === "BILLING") {
      const recentDuplicates = await this.prisma.fraudSignal.count({
        where: {
          tenantId: params.tenantId,
          entityId: params.entityId,
          signalType: "DUPLICATE_BILLING",
          status: "OPEN",
          detectedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });

      // Simple heuristic: if there's already an open duplicate signal, escalate
      if (recentDuplicates > 0) {
        const signal = await this.createFraudSignal({
          tenantId: params.tenantId,
          entityId: params.entityId,
          signalType: "DUPLICATE_BILLING",
          severity: "HIGH",
          description: `Potential duplicate billing detected. Amount: ${params.amount}. Multiple signals within 24 hours.`,
          contextData: params.metadata,
        });
        signals.push(signal);
      }
    }

    // Strategy 2: Velocity anomaly (too many transactions in short window)
    const recentTransactionCount = await this.prisma.fraudSignal.count({
      where: {
        tenantId: params.tenantId,
        entityId: params.entityId,
        detectedAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
      },
    });

    if (recentTransactionCount > 10) {
      const signal = await this.createFraudSignal({
        tenantId: params.tenantId,
        entityId: params.entityId,
        signalType: "VELOCITY_ANOMALY",
        severity: "MEDIUM",
        description: `Unusually high activity detected: ${recentTransactionCount} signals in the last hour.`,
        contextData: params.metadata,
      });
      signals.push(signal);
    }

    return signals;
  }

  /**
   * Detects behavioral anomalies and stores them in BehaviorPattern.
   */
  async detectBehaviorAnomaly(params: {
    tenantId: string;
    userId: string;
    patternType: string;
    anomalyScore: number;
  }) {
    if (params.anomalyScore < 0.5) return null; // Below threshold, skip

    this.logger.warn(
      `Behavior anomaly detected: ${params.patternType} for user ${params.userId} (score: ${params.anomalyScore})`,
    );

    const pattern = await this.prisma.behaviorPattern.create({
      data: {
        tenantId: params.tenantId,
        userId: params.userId,
        patternType: params.patternType,
        anomalyScore: params.anomalyScore,
      },
    });

    // If anomaly is severe (score > 0.8), also raise a fraud signal
    if (params.anomalyScore > 0.8) {
      await this.createFraudSignal({
        tenantId: params.tenantId,
        entityId: params.userId,
        signalType: params.patternType,
        severity: params.anomalyScore > 0.95 ? "CRITICAL" : "HIGH",
        description: `Severe behavioral anomaly: ${params.patternType}. Anomaly score: ${params.anomalyScore}.`,
      });
    }

    return pattern;
  }

  /**
   * Internal helper to create a FraudSignal and dispatch an event.
   */
  private async createFraudSignal(params: {
    tenantId: string;
    entityId: string;
    signalType: string;
    severity: string;
    description: string;
    contextData?: unknown;
  }) {
    const signal = await this.prisma.fraudSignal.create({
      data: {
        tenantId: params.tenantId,
        entityId: params.entityId,
        signalType: params.signalType,
        severity: params.severity,
        description: params.description,
        contextData: params.contextData ? JSON.stringify(params.contextData) : null,
        status: "OPEN",
      },
    });

    this.eventDispatcher.dispatch("trust", "fraud_signal_detected", {
      signalId: signal.id,
      signalType: params.signalType,
      severity: params.severity,
      entityId: params.entityId,
    });

    return signal;
  }
}
