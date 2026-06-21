import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CheckoutDto } from "./dto/checkout.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  processCheckout(@Body() checkoutDto: CheckoutDto, @Request() req: unknown) {
    return this.checkoutService.processCheckout(checkoutDto, (req as any).user!.id);
  }
}
