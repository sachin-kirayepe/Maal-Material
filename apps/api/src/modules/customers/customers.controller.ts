import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@Controller("customers")
@UseGuards(AuthGuard, RolesGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Permissions("customers:create")
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customersService.create(createCustomerDto);
    return createApiResponse(true, customer, "Customer created successfully");
  }

  @Get()
  @Permissions("customers:read")
  async findAll(
    @Query("skip") skip?: number,
    @Query("take") take?: number,
    @Query("search") search?: string,
    @Query("type") type?: string,
  ) {
    const data = await this.customersService.findAll({ skip, take, search, type });
    return createApiResponse(true, data, "Customers retrieved successfully");
  }

  @Get(":id")
  @Permissions("customers:read")
  async findOne(@Param("id") id: string) {
    const customer = await this.customersService.findOne(id);
    return createApiResponse(true, customer, "Customer retrieved successfully");
  }

  @Patch(":id")
  @Permissions("customers:update")
  async update(@Param("id") id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customersService.update(id, updateCustomerDto);
    return createApiResponse(true, customer, "Customer updated successfully");
  }

  @Delete(":id")
  @Permissions("customers:delete")
  async remove(@Param("id") id: string) {
    await this.customersService.remove(id);
    return createApiResponse(true, null, "Customer deleted successfully");
  }
}
