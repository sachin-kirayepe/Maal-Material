import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DevOps and Infrastructure Data...");
  const tenantId = "tenant-1";

  await prisma.releaseVersion.create({
    data: {
      tenantId,
      version: "v2.1.0",
      notes: "Initial enterprise release",
      isPublished: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  await prisma.releaseVersion.create({
    data: {
      tenantId,
      version: "v2.2.0-rc1",
      notes: "Added distributed financial core",
      isPublished: false,
    },
  });

  // Seed Deployments
  await prisma.deployment.create({
    data: {
      tenantId,
      version: "v2.1.0",
      environment: "production",
      status: "SUCCESS",
      initiatorId: "system",
      completedAt: new Date(Date.now() - 86400000 * 4),
      deploymentEvent: {
        create: [
          {
            state: "STARTED",
            message: "Deployment triggered",
            timestamp: new Date(Date.now() - 86400000 * 4 - 600000),
          },
          {
            state: "DEPLOYING",
            message: "Rolling out pods",
            timestamp: new Date(Date.now() - 86400000 * 4 - 300000),
          },
          {
            state: "SUCCESS",
            message: "Deployment verified",
            timestamp: new Date(Date.now() - 86400000 * 4),
          },
        ],
      },
    },
  });

  await prisma.deployment.create({
    data: {
      tenantId,
      version: "v2.2.0-rc1",
      environment: "staging",
      status: "DEPLOYING",
      initiatorId: "admin",
      deploymentEvent: {
        create: [
          {
            state: "STARTED",
            message: "Deployment triggered",
            timestamp: new Date(Date.now() - 10000),
          },
          { state: "DEPLOYING", message: "Waiting for pod readiness", timestamp: new Date() },
        ],
      },
    },
  });

  // Seed CI/CD Pipelines
  await prisma.pipelineExecution.create({
    data: {
      tenantId,
      pipelineName: "build-and-push-api",
      commitHash: "a1b2c3d4",
      branch: "main",
      status: "SUCCESS",
      durationMs: 125000,
      triggeredBy: "github-webhook",
      startedAt: new Date(Date.now() - 86400000 * 4 - 1000000),
      completedAt: new Date(Date.now() - 86400000 * 4 - 875000),
    },
  });

  await prisma.pipelineExecution.create({
    data: {
      tenantId,
      pipelineName: "build-and-push-web",
      commitHash: "a1b2c3d4",
      branch: "main",
      status: "RUNNING",
      triggeredBy: "github-webhook",
      startedAt: new Date(),
    },
  });

  // Seed Environment Config
  await prisma.environmentConfig.upsert({
    where: {
      tenantId_environment_key: { tenantId, environment: "production", key: "API_TIMEOUT" },
    },
    update: {},
    create: { tenantId, environment: "production", key: "API_TIMEOUT", value: "5000" },
  });

  await prisma.environmentConfig.upsert({
    where: {
      tenantId_environment_key: { tenantId, environment: "production", key: "DB_PASSWORD" },
    },
    update: {},
    create: {
      tenantId,
      environment: "production",
      key: "DB_PASSWORD",
      value: "********",
      isSecret: true,
    },
  });

  // Seed Cluster Nodes (K8s worker nodes)
  await prisma.clusterNode.create({
    data: {
      tenantId,
      name: "k8s-worker-us-east-1a",
      role: "WORKER",
      region: "us-east-1",
      status: "READY",
      ipAddress: "10.0.1.45",
    },
  });
  await prisma.clusterNode.create({
    data: {
      tenantId,
      name: "k8s-worker-us-east-1b",
      role: "WORKER",
      region: "us-east-1",
      status: "READY",
      ipAddress: "10.0.1.46",
    },
  });

  // Seed Infrastructure Metrics
  const baseTime = Date.now();
  for (let i = 0; i < 20; i++) {
    await prisma.infrastructureMetric.create({
      data: {
        tenantId,
        nodeId: "k8s-worker-us-east-1a",
        metricType: "cpu_usage_percent",
        value: 40 + Math.random() * 20,
        unit: "%",
        timestamp: new Date(baseTime - (20 - i) * 60000), // last 20 minutes
      },
    });
  }

  console.log("DevOps seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
