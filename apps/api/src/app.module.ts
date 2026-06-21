import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from "path";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "@database/prisma.module";
import { HealthModule } from "@modules/health/health.module";
import { AuthModule } from "@modules/auth/auth.module";
import { AuthGuard } from "./common/guards/auth.guard";
import { UsersModule } from "@modules/users/users.module";
import { RbacModule } from "@modules/rbac/rbac.module";
import { CategoriesModule } from "@modules/categories/categories.module";
import { UnitsModule } from "@modules/units/units.module";
import { ProductsModule } from "@modules/products/products.module";
import { WarehousesModule } from "@modules/warehouses/warehouses.module";
import { StockModule } from "@modules/stock/stock.module";
import configuration from "@config/configuration";
import { envValidationSchema } from "@config/env.validation";
import { CustomersModule } from "@modules/customers/customers.module";
import { InvoicesModule } from "@modules/invoices/invoices.module";
import { PaymentsModule } from "@modules/payments/payments.module";
import { LedgerModule } from "./modules/ledger/ledger.module";
import { CreditModule } from "./modules/credit/credit.module";
import { SettlementsModule } from "./modules/settlements/settlements.module";
import { RemindersModule } from "./modules/reminders/reminders.module";
import { DeliveryModule } from "./modules/delivery/delivery.module";
import { DispatchModule } from "./modules/dispatch/dispatch.module";
import { DriversModule } from "./modules/drivers/drivers.module";
import { FleetModule } from "./modules/fleet/fleet.module";
import { ShippingModule } from "./modules/shipping/shipping.module";
import { SuppliersModule } from "./modules/suppliers/suppliers.module";
import { PurchasesModule } from "./modules/purchases/purchases.module";
import { ProcurementModule } from "./modules/procurement/procurement.module";
import { PurchasePaymentsModule } from "./modules/purchase-payments/purchase-payments.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { OrderItemsModule } from "./modules/order-items/order-items.module";
import { OrderFulfillmentModule } from "./modules/order-fulfillment/order-fulfillment.module";
import { CartModule } from "./modules/cart/cart.module";
import { CheckoutModule } from "./modules/checkout/checkout.module";
import { TenantMiddleware } from "./common/middleware/tenant.middleware";
import { TransactionIntegrityInterceptor } from "./common/interceptors/transaction-integrity.interceptor";
import { AuditLoggingInterceptor } from "./common/interceptors/audit-logging.interceptor";
import { SentryInterceptor } from "./common/interceptors/sentry.interceptor";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { ShopsModule } from "./modules/shops/shops.module";
import { OfflineSyncModule } from "./modules/offline-sync/offline-sync.module";
import { CommonEnginesModule } from "./common/engines/engines.module";
import { ReliabilityModule } from "./common/reliability/reliability.module";
import { ReconciliationModule } from "./modules/reconciliation/reconciliation.module";
import { WhatsappCommerceModule } from "./modules/whatsapp-commerce/whatsapp-commerce.module";
import { NetworkResilienceModule } from "./modules/network-resilience/network-resilience.module";
import { IntelligenceModule } from "./modules/intelligence/intelligence.module";
import { ShopUsersModule } from "./modules/shop-users/shop-users.module";
import { MarketplaceModule } from "./modules/marketplace/marketplace.module";
import { PredictionsModule } from "./modules/predictions/predictions.module";
import { RecommendationsModule } from "./modules/recommendations/recommendations.module";
import { RiskAnalysisModule } from "./modules/risk-analysis/risk-analysis.module";
import { OperationalAnalyticsModule } from "./modules/operational-analytics/operational-analytics.module";
import { TrustModule } from "./modules/trust/trust.module";
import { FraudDetectionModule } from "./modules/fraud-detection/fraud-detection.module";
import { ReputationModule } from "./modules/reputation/reputation.module";
import { DisputesModule } from "./modules/disputes/disputes.module";
import { RiskAssessmentModule } from "./modules/risk-assessment/risk-assessment.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { SitesModule } from "./modules/sites/sites.module";
import { WorkersModule } from "./modules/workers/workers.module";
import { AttendanceModule } from "./modules/attendance/attendance.module";
import { MaterialConsumptionModule } from "./modules/material-consumption/material-consumption.module";
import { ProjectCostingModule } from "./modules/project-costing/project-costing.module";
import { EventsModule } from "./modules/events/events.module";
import { RealtimeModule } from "./modules/realtime/realtime.module";
import { JobsModule } from './modules/jobs/jobs.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RedisModule } from "@nestjs-modules/ioredis";
import { ActivityModule } from "./modules/activity/activity.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { BusinessIntelligenceModule } from "./modules/business-intelligence/business-intelligence.module";
import { KpiModule } from "./modules/kpi/kpi.module";
import { RulesEngineModule } from "./modules/rules-engine/rules-engine.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { AiModule } from "./modules/ai/ai.module";
import { CopilotModule } from "./modules/copilot/copilot.module";
import { AutomationModule } from "./modules/automation/automation.module";
import { InsightsModule } from "./modules/insights/insights.module";
import { SecurityModule } from "./modules/security/security.module";
import { AuditModule } from "./modules/audit/audit.module";
import { ObservabilityModule } from "./modules/observability/observability.module";
import { ResilienceModule } from "./modules/resilience/resilience.module";
import { ComplianceModule } from "./modules/compliance/compliance.module";
import { DeviceManagementModule } from "./modules/device-management/device-management.module";
import { MobileSyncModule } from "./modules/mobile-sync/mobile-sync.module";
import { FieldOperationsModule } from "./modules/field-operations/field-operations.module";
import { OfflineEngineModule } from "./modules/offline-engine/offline-engine.module";
import { PlatformModule } from "./modules/platform/platform.module";
import { GatewayModule } from "./modules/gateway/gateway.module";
import { DistributedModule } from "./modules/distributed/distributed.module";
import { InfrastructureModule } from "./modules/infrastructure/infrastructure.module";
import { CacheModule } from "./modules/cache/cache.module";
import { DeploymentsModule } from "./modules/deployments/deployments.module";
import { DevopsModule } from "./modules/devops/devops.module";
import { MonitoringModule } from "./modules/monitoring/monitoring.module";
import { ReleasesModule } from "./modules/releases/releases.module";
import { AccountingModule } from "./modules/accounting/accounting.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { TaxModule } from "./modules/tax/tax.module";
import { TreasuryModule } from "./modules/treasury/treasury.module";
import { VendorsModule } from "./modules/vendors/vendors.module";
import { SupplyChainModule } from "./modules/supply-chain/supply-chain.module";
import { SourcingModule } from "./modules/sourcing/sourcing.module";
import { PurchaseIntelligenceModule } from "./modules/purchase-intelligence/purchase-intelligence.module";
import { ConstructionProjectsModule } from "./modules/construction-projects/construction-projects.module";
import { ConstructionBoqModule } from "./modules/construction-boq/construction-boq.module";
import { ConstructionSiteOperationsModule } from "./modules/construction-site-operations/construction-site-operations.module";
import { ConstructionLaborModule } from "./modules/construction-labor/construction-labor.module";
import { ConstructionEquipmentModule } from "./modules/construction-equipment/construction-equipment.module";
import { B2bMarketplaceModule } from "./modules/b2b-marketplace/b2b-marketplace.module";
import { VendorNetworkModule } from "./modules/vendor-network/vendor-network.module";
import { DigitalExchangeModule } from "./modules/digital-exchange/digital-exchange.module";
import { CommerceIntelligenceModule } from "./modules/commerce-intelligence/commerce-intelligence.module";
import { EcosystemModule } from "./modules/ecosystem/ecosystem.module";
import { SimplifiedWorkflowsModule } from "./modules/simplified-workflows/simplified-workflows.module";
import { SmbOnboardingModule } from "./modules/smb-onboarding/smb-onboarding.module";
import { CommerceNetworkModule } from "./modules/commerce-network/commerce-network.module";
import { RfqExchangeModule } from "./modules/rfq-exchange/rfq-exchange.module";
import { InventorySharingModule } from "./modules/inventory-sharing/inventory-sharing.module";
import { VendorDiscoveryModule } from "./modules/vendor-discovery/vendor-discovery.module";
import { EquipmentModule } from "./modules/equipment/equipment.module";
import { RentalsModule } from "./modules/rentals/rentals.module";
import { EquipmentAvailabilityModule } from "./modules/equipment-availability/equipment-availability.module";
import { RentalRfqModule } from "./modules/rental-rfq/rental-rfq.module";
import { UniversalApiModule } from "./modules/universal-api/universal-api.module";

@Module({
  imports: [
    // Security: Rate Limiting / DDoS Protection
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Global Config Module with structural environment validations
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // Global Scaling: Multi-language support
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(process.cwd(), "src/i18n/"),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
      ],
    }),

    // Global Database Core Module
    PrismaModule,

    // Global Redis Module
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: "single",
        url: `${process.env.REDIS_HOST?.includes('upstash') ? 'rediss' : 'redis'}://${process.env.REDIS_PASSWORD ? `:${process.env.REDIS_PASSWORD}@` : ''}${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
      }),
    }),

    // Auth & RBAC Domain Modules
    HealthModule,
    AuthModule,
    UsersModule,
    RbacModule,

    // Inventory Domain Modules
    CategoriesModule,
    UnitsModule,
    ProductsModule,
    WarehousesModule,
    StockModule,

    // Logistics & Delivery Domain Modules
    DeliveryModule,
    DispatchModule,
    DriversModule,
    FleetModule,
    ShippingModule,

    // Billing & Commerce Domain Modules
    ShopUsersModule,
    MarketplaceModule,
    CustomersModule,
    InvoicesModule,
    PaymentsModule,
    LedgerModule,
    CreditModule,
    SettlementsModule,
    RemindersModule,

    // Intelligence & Analytics Modules
    ProjectsModule,
    IntelligenceModule,
    PredictionsModule,
    RecommendationsModule,
    RiskAnalysisModule,
    OperationalAnalyticsModule,
    TrustModule,
    FraudDetectionModule,
    ReputationModule,
    DisputesModule,
    RiskAssessmentModule,

    // Procurement & Supply Chain Domain Modules
    SuppliersModule,
    PurchasesModule,
    ProcurementModule,
    PurchasePaymentsModule,
    OrdersModule,
    OrderItemsModule,
    OrderFulfillmentModule,
    CartModule,
    CheckoutModule,
    TenantsModule,
    ShopsModule,
    OfflineSyncModule,
    CommonEnginesModule,
    ReliabilityModule,
    ReconciliationModule,
    WhatsappCommerceModule,
    NetworkResilienceModule,

    // Contractor ERP & Construction Management
    SitesModule,
    WorkersModule,
    AttendanceModule,
    MaterialConsumptionModule,
    ProjectCostingModule,

    // Realtime, Events & Background Jobs
    EventsModule,
    RealtimeModule,
    JobsModule,
    NotificationsModule,
    ActivityModule,
    AnalyticsModule,
    BusinessIntelligenceModule,
    KpiModule,
    RulesEngineModule,
    ReportsModule,
    AiModule,
    CopilotModule,
    AutomationModule,
    InsightsModule,
    SecurityModule,
    AuditModule,
    ObservabilityModule,
    ResilienceModule,
    ComplianceModule,
    DeviceManagementModule,
    MobileSyncModule,
    FieldOperationsModule,
    OfflineEngineModule,
    PlatformModule,
    GatewayModule,
    DistributedModule,
    InfrastructureModule,
    CacheModule,
    DeploymentsModule,
    DevopsModule,
    MonitoringModule,
    ReleasesModule,
    AccountingModule,
    FinanceModule,
    TaxModule,
    TreasuryModule,
    VendorsModule,
    SupplyChainModule,
    SourcingModule,
    PurchaseIntelligenceModule,
    ConstructionProjectsModule,
    ConstructionBoqModule,
    ConstructionSiteOperationsModule,
    ConstructionLaborModule,
    ConstructionEquipmentModule,
    B2bMarketplaceModule,
    VendorNetworkModule,
    DigitalExchangeModule,
    CommerceIntelligenceModule,
    EcosystemModule,
    SimplifiedWorkflowsModule,
    SmbOnboardingModule,
    CommerceNetworkModule,
    RfqExchangeModule,
    InventorySharingModule,
    VendorDiscoveryModule,
    EquipmentModule,
    RentalsModule,
    EquipmentAvailabilityModule,
    RentalRfqModule,
    UniversalApiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionIntegrityInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes("*");
  }
}
