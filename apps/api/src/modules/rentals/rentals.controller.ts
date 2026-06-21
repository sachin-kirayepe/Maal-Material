import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { RentalsService } from "./rentals.service";

@Controller("api/v1/rentals")
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get()
  async getBookings(
    @Query("tenantId") tenantId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.rentalsService.getBookings(tenantId || "tenant-1", Number(page), Number(limit));
  }

  @Post("intent")
  async createBookingIntent(@Body() data: unknown) {
    return this.rentalsService.createBookingIntent({
      ...(data as any),
      startDate: new Date((data as any).startDate),
      endDate: new Date((data as any).endDate),
    });
  }

  @Post(":id/approve")
  async approveBooking(@Param("id") bookingId: string) {
    return this.rentalsService.approveBooking(bookingId);
  }
}
