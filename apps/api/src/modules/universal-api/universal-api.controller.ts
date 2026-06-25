import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Get, Body, Logger, UseGuards } from '@nestjs/common';
import { EnterpriseDigitalTwinEngine } from "../../common/engines/enterprise-digital-twin.engine";
import { PredictiveSimulationOrchestratorEngine } from "../../common/engines/predictive-simulation-orchestrator.engine";
import { GlobalInfrastructureObservabilityEngine } from "../../common/engines/global-infrastructure-observability.engine";
import { AutonomousMachineFleetOrchestratorEngine } from "../../common/engines/autonomous-machine-fleet-orchestrator.engine";
import { MachineToMachineEconomyEngine } from "../../common/engines/machine-to-machine-economy.engine";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/civilization")
export class UniversalApiController {
  private readonly logger = new Logger(UniversalApiController.name);

  constructor(
    private readonly digitalTwinEngine: EnterpriseDigitalTwinEngine,
    private readonly simulationEngine: PredictiveSimulationOrchestratorEngine,
    private readonly observabilityEngine: GlobalInfrastructureObservabilityEngine,
    private readonly fleetOrchestrator: AutonomousMachineFleetOrchestratorEngine,
    private readonly m2mEconomyEngine: MachineToMachineEconomyEngine,
  ) {}

  @Post("digital-twin/sync")
  async syncDigitalTwin(@Body() body: { physicalAssetId: string; locationHash: string }) {
    this.logger.log(
      `API Gateway: Triggering Digital Twin Sync for Asset [${body.physicalAssetId}]`,
    );
    return await this.digitalTwinEngine.synchronizeDigitalTwin(
      "SYSTEM_TENANT",
      "INDUSTRIAL_ROBOT",
      body.physicalAssetId,
      { location: body.locationHash },
    );
  }

  @Post("simulation/predict")
  async predictSimulation(@Body() body: { originTwinId: string; parameterDelta: number }) {
    this.logger.log(
      `API Gateway: Triggering Predictive Simulation for Twin [${body.originTwinId}]`,
    );
    return await this.simulationEngine.spinUpScenarioSimulation(
      "SYSTEM_TENANT",
      body.originTwinId,
      "STRESS_TEST",
      { delta: body.parameterDelta },
    );
  }

  @Get("infrastructure/telemetry")
  async getTelemetry() {
    this.logger.log(`API Gateway: Polling Global Infrastructure Telemetry`);
    
    // Replace mock with actual DB query from InfrastructureMetric
    const metrics = await this.observabilityEngine['prisma'].infrastructureMetric.findMany({
      where: { metricType: 'FABRIC_LATENCY' },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    if (metrics.length > 0) {
      return {
        status: "ACTIVE",
        telemetry: metrics,
      };
    }

    return await this.observabilityEngine.logPlanetaryTelemetry(
      "GLOBAL_FABRIC_ALPHA",
      0.01,
      1500,
      0.4,
    );
  }

  @Post("iot/fleet/dispatch")
  async dispatchFleet(
    @Body() body: { fleetName: string; missionObjective: string; activeMachines: number },
  ) {
    this.logger.log(`API Gateway: Dispatching IoT Fleet [${body.fleetName}]`);
    return await this.fleetOrchestrator.orchestrateFleetMission(
      body.fleetName,
      body.missionObjective,
      body.activeMachines,
    );
  }

  @Post("economy/settle")
  async settleTransaction(
    @Body()
    body: {
      buyerMachineId: string;
      sellerMachineId: string;
      serviceType: string;
      transactionValue: number;
    },
  ) {
    this.logger.log(`API Gateway: Settling M2M Transaction for Service [${body.serviceType}]`);
    return await this.m2mEconomyEngine.executeM2MTransaction(
      body.buyerMachineId,
      body.sellerMachineId,
      body.serviceType,
      body.transactionValue,
    );
  }
}
