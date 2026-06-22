import * as Sentry from "@sentry/node";
import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe, VersioningType, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { TransactionInterceptor } from "./common/interceptors/transaction.interceptor";
import { TenantInterceptor } from "./common/interceptors/tenant.interceptor";
import { IdempotencyGuard } from "./common/guards/idempotency.guard";
import { PrismaService } from "./database/prisma.service";

async function bootstrap() {
  const logger = new Logger("NestBootstrap");
  
  // M-08 FIX: Only initialize Sentry if DSN is actually provided
  const sentryDsn = process.env.SENTRY_DSN;
  if (sentryDsn && sentryDsn.trim() !== "") {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
    });
    logger.log("Sentry APM initialized");
  } else {
    logger.warn("SENTRY_DSN not configured — error tracking disabled");
  }

  const app = await NestFactory.create(AppModule);

  // M-07 FIX: CORS is environment-aware — restrict origins in production
  const isDev = (process.env.NODE_ENV || "development") !== "production";
  const corsOrigins = isDev
    ? ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]
    : [process.env.FRONTEND_URL || "https://maal-material.netlify.app"].filter(Boolean) as string[];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-idempotency-key", "x-tenant-id", "x-shop-id", "X-Requested-With"],
  });

  // L-05 FIX: Enable payload compression
  app.use(compression());

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  const prismaService = app.get(PrismaService);
  const reflector = app.get(Reflector);

  // Attach global enterprise error boundaries and interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransactionInterceptor(prismaService), new TenantInterceptor(reflector));

  app.useGlobalGuards(new IdempotencyGuard());

  // Global pipe for strict payload validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Maal-Material Platform API")
    .setDescription("Enterprise-scale core backend endpoints for Maal-Material")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, "0.0.0.0");

  logger.log(`====================================================`);
  logger.log(`Maal-Material API Service active at http://localhost:${port}`);
  logger.log(`Enterprise Transaction boundaries active.`);
  logger.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  logger.log(`====================================================`);
}

bootstrap();
