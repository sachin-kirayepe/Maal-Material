const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src", "modules");

const templates = {
  marketplace: {
    controller: `
import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { B2bMarketplaceService } from './b2b-marketplace.service';

@Controller('b2b-marketplace')
export class B2bMarketplaceController {
  constructor(private readonly service: B2bMarketplaceService) {}

  @Post('storefronts')
  createStorefront(@Body() data: any) { return this.service.createStorefront(data); }

  @Get('storefronts')
  getStorefronts() { return this.service.getStorefronts(); }

  @Post('orders')
  createOrder(@Body() data: any) { return this.service.createOrder(data); }

  @Get('orders')
  getOrders() { return this.service.getOrders(); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class B2bMarketplaceService {
  constructor(private prisma: PrismaService) {}

  createStorefront(data: any) {
    return this.prisma.vendorStorefront.create({ data });
  }

  getStorefronts() {
    return this.prisma.vendorStorefront.findMany({ include: { vendor: true } });
  }

  createOrder(data: any) {
    return this.prisma.commerceOrder.create({ data });
  }

  getOrders() {
    return this.prisma.commerceOrder.findMany({ include: { vendor: true }, orderBy: { createdAt: 'desc' } });
  }
}
    `,
  },
  vendor: {
    controller: `
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VendorNetworkService } from './vendor-network.service';

@Controller('vendor-network')
export class VendorNetworkController {
  constructor(private readonly service: VendorNetworkService) {}

  @Post('vendors')
  createVendor(@Body() data: any) { return this.service.createVendor(data); }

  @Get('vendors')
  getVendors() { return this.service.getVendors(); }

  @Post('ratings')
  rateVendor(@Body() data: any) { return this.service.rateVendor(data); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class VendorNetworkService {
  constructor(private prisma: PrismaService) {}

  createVendor(data: any) {
    return this.prisma.marketplaceVendor.create({ data });
  }

  getVendors() {
    return this.prisma.marketplaceVendor.findMany({ include: { ratings: true } });
  }

  rateVendor(data: any) {
    return this.prisma.vendorRating.create({ data });
  }
}
    `,
  },
  exchange: {
    controller: `
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DigitalExchangeService } from './digital-exchange.service';

@Controller('digital-exchange')
export class DigitalExchangeController {
  constructor(private readonly service: DigitalExchangeService) {}

  @Post('rfqs')
  createRfq(@Body() data: any) { return this.service.createRfq(data); }

  @Get('rfqs')
  getRfqs() { return this.service.getRfqs(); }

  @Post('quotations')
  submitQuotation(@Body() data: any) { return this.service.submitQuotation(data); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DigitalExchangeService {
  constructor(private prisma: PrismaService) {}

  createRfq(data: any) {
    return this.prisma.rFQExchange.create({ data });
  }

  getRfqs() {
    return this.prisma.rFQExchange.findMany({ include: { quotations: true }, orderBy: { createdAt: 'desc' } });
  }

  submitQuotation(data: any) {
    return this.prisma.marketplaceQuotation.create({ data });
  }
}
    `,
  },
  intelligence: {
    controller: `
import { Controller, Get } from '@nestjs/common';
import { CommerceIntelligenceService } from './commerce-intelligence.service';

@Controller('commerce-intelligence')
export class CommerceIntelligenceController {
  constructor(private readonly service: CommerceIntelligenceService) {}

  @Get('analytics')
  getAnalytics() { return this.service.getAnalytics(); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CommerceIntelligenceService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const totalOrders = await this.prisma.commerceOrder.count();
    const totalRfqs = await this.prisma.rFQExchange.count();
    const totalVendors = await this.prisma.marketplaceVendor.count();
    
    // Aggregate order volume
    const orders = await this.prisma.commerceOrder.findMany();
    const gmv = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      totalRfqs,
      totalVendors,
      grossMerchandiseValue: gmv
    };
  }
}
    `,
  },
  ecosystem: {
    controller: `
import { Controller, Get, Post, Body } from '@nestjs/common';
import { EcosystemService } from './ecosystem.service';

@Controller('ecosystem')
export class EcosystemController {
  constructor(private readonly service: EcosystemService) {}

  @Post('connections')
  createConnection(@Body() data: any) { return this.service.createConnection(data); }

  @Get('connections')
  getConnections() { return this.service.getConnections(); }

  @Post('settlements')
  processSettlement(@Body() data: any) { return this.service.processSettlement(data); }

  @Get('settlements')
  getSettlements() { return this.service.getSettlements(); }
}
    `,
    service: `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class EcosystemService {
  constructor(private prisma: PrismaService) {}

  createConnection(data: any) {
    return this.prisma.ecosystemConnection.create({ data });
  }

  getConnections() {
    return this.prisma.ecosystemConnection.findMany({ include: { vendor: true } });
  }

  processSettlement(data: any) {
    return this.prisma.marketplaceSettlement.create({ data });
  }

  getSettlements() {
    return this.prisma.marketplaceSettlement.findMany({ include: { vendor: true, order: true } });
  }
}
    `,
  },
};

fs.writeFileSync(
  path.join(srcDir, "b2b-marketplace", "b2b-marketplace.controller.ts"),
  templates.marketplace.controller,
);
fs.writeFileSync(
  path.join(srcDir, "b2b-marketplace", "b2b-marketplace.service.ts"),
  templates.marketplace.service,
);

fs.writeFileSync(
  path.join(srcDir, "vendor-network", "vendor-network.controller.ts"),
  templates.vendor.controller,
);
fs.writeFileSync(
  path.join(srcDir, "vendor-network", "vendor-network.service.ts"),
  templates.vendor.service,
);

fs.writeFileSync(
  path.join(srcDir, "digital-exchange", "digital-exchange.controller.ts"),
  templates.exchange.controller,
);
fs.writeFileSync(
  path.join(srcDir, "digital-exchange", "digital-exchange.service.ts"),
  templates.exchange.service,
);

fs.writeFileSync(
  path.join(srcDir, "commerce-intelligence", "commerce-intelligence.controller.ts"),
  templates.intelligence.controller,
);
fs.writeFileSync(
  path.join(srcDir, "commerce-intelligence", "commerce-intelligence.service.ts"),
  templates.intelligence.service,
);

fs.writeFileSync(
  path.join(srcDir, "ecosystem", "ecosystem.controller.ts"),
  templates.ecosystem.controller,
);
fs.writeFileSync(
  path.join(srcDir, "ecosystem", "ecosystem.service.ts"),
  templates.ecosystem.service,
);

console.log("Marketplace Backend endpoints written");
