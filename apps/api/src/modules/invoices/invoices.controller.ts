import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@Controller("v1/invoices")
@UseGuards(AuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Permissions("invoices:create")
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req: unknown) {
    const userId = (req as any).user!.id;
    const invoice = await this.invoicesService.create(createInvoiceDto, userId);
    return createApiResponse(true, invoice, "Invoice created successfully");
  }

  @Get()
  @Permissions("invoices:read")
  async findAll(
    @Query("skip") skip?: number,
    @Query("take") take?: number,
    @Query("search") search?: string,
    @Query("status") status?: string,
  ) {
    const data = await this.invoicesService.findAll({ skip, take, search, status });
    return createApiResponse(true, data, "Invoices retrieved successfully");
  }

  @Get(":id")
  @Permissions("invoices:read")
  async findOne(@Param("id") id: string) {
    const invoice = await this.invoicesService.findOne(id);
    return createApiResponse(true, invoice, "Invoice retrieved successfully");
  }
}
