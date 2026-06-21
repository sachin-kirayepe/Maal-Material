import { Test, TestingModule } from "@nestjs/testing";
import { TenantsService } from "./tenants.service";
import { PrismaService } from "@database/prisma.service";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

describe("TenantsService - Enterprise Core", () => {
  let service: TenantsService;

  const mockPrismaService = {
    tenant: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
    tenantSubscription: {
      create: jest.fn(),
      count: jest.fn(),
    },
    shop: { count: jest.fn() },
    product: { count: jest.fn() },
    order: { count: jest.fn(), aggregate: jest.fn() },
    marketplaceListing: { count: jest.fn() },
    shopUser: { count: jest.fn() },
    shopAddress: { groupBy: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        { provide: RealtimeGateway, useValue: {} }
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create (Zero-Trust Provisioning)", () => {
    it("should throw ConflictException if domain already exists", async () => {
      mockPrismaService.tenant.findFirst.mockResolvedValue({ id: "t1", domain: "test.com" });

      await expect(service.create({ name: "Test", domain: "test.com" })).rejects.toThrow(
        ConflictException,
      );
    });

    it("should auto-provision FREE subscription and create tenant via transaction", async () => {
      mockPrismaService.tenant.findFirst.mockResolvedValue(null); // Domain is free
      
      const mockCreatedTenant = { id: "t-new", name: "Acme", domain: "acme.com" };
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback(mockPrismaService);
      });
      mockPrismaService.tenant.create.mockResolvedValue(mockCreatedTenant);
      
      // Mock findOne for the return value
      jest.spyOn(service, "findOne").mockResolvedValue(mockCreatedTenant as any);

      const result = await service.create({ name: "Acme", domain: "acme.com" });
      
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(mockPrismaService.tenantSubscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ planName: "FREE", tenantId: "t-new" })
        })
      );
      expect(result).toEqual(mockCreatedTenant);
    });
  });

  describe("findAll (Pagination & Filters)", () => {
    it("should return paginated tenants with metadata", async () => {
      const mockTenants = [{ id: "t1", name: "A" }, { id: "t2", name: "B" }];
      mockPrismaService.tenant.findMany.mockResolvedValue(mockTenants);
      mockPrismaService.tenant.count.mockResolvedValue(2);

      const result = await service.findAll({ page: 1, limit: 10, search: "Acme" });

      expect(result.items).toEqual(mockTenants);
      expect(result.meta.totalItems).toBe(2);
      expect(result.meta.currentPage).toBe(1);
      expect(mockPrismaService.tenant.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [{ name: { contains: "Acme" } }, { domain: { contains: "Acme" } }],
          }),
        })
      );
    });
  });

  describe("update", () => {
    it("should throw NotFoundException if tenant not found", async () => {
      mockPrismaService.tenant.findFirst.mockResolvedValue(null);
      await expect(service.update("invalid", { name: "A" })).rejects.toThrow(NotFoundException);
    });

    it("should prevent domain hijacking (ConflictException) on update", async () => {
      mockPrismaService.tenant.findFirst.mockResolvedValueOnce({ id: "t1", domain: "old.com" });
      // Simulating another tenant holds the target domain
      mockPrismaService.tenant.findFirst.mockResolvedValueOnce({ id: "t2", domain: "new.com" });

      await expect(service.update("t1", { domain: "new.com" })).rejects.toThrow(ConflictException);
    });
  });

  describe("softDelete", () => {
    it("should mark tenant as SUSPENDED and deletedAt = now", async () => {
      mockPrismaService.tenant.findFirst.mockResolvedValue({ id: "t1", name: "Test" });
      
      await service.softDelete("t1");
      
      expect(mockPrismaService.tenant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "t1" },
          data: expect.objectContaining({ status: "SUSPENDED", deletedAt: expect.any(Date) })
        })
      );
    });
  });

  describe("Analytics Integrity (Data Isolation)", () => {
    it("should aggregate data strictly within the specified tenantId", async () => {
      mockPrismaService.tenant.findFirst.mockResolvedValue({ id: "t1" });
      mockPrismaService.shop.count.mockResolvedValue(5);
      mockPrismaService.product.count.mockResolvedValue(50);
      mockPrismaService.order.count.mockResolvedValue(100);
      mockPrismaService.marketplaceListing.count.mockResolvedValue(10);
      mockPrismaService.shopUser.count.mockResolvedValue(20);
      mockPrismaService.order.aggregate.mockResolvedValue({ _sum: { grandTotal: 50000 } });

      const analytics = await service.getAnalytics("t1");

      // Verify that every single query enforces `tenantId: "t1"`
      expect(mockPrismaService.shop.count).toHaveBeenCalledWith({ where: expect.objectContaining({ tenantId: "t1" }) });
      expect(mockPrismaService.product.count).toHaveBeenCalledWith({ where: expect.objectContaining({ tenantId: "t1" }) });
      expect(mockPrismaService.order.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ tenantId: "t1" }) })
      );

      expect(analytics.totalRevenue).toBe(50000);
      expect(analytics.totalProducts).toBe(50);
    });
  });
});
