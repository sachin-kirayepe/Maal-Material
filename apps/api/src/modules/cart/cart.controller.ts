import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/cart.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: unknown) {
    // In a B2B app, the customerId might come from the user's linked customer profile.
    // For this prototype, we'll assume req.user!.id is used or passed in body
    // Using a hardcoded test customer ID for simplicity or extracting from headers
    const customerId = (req as any).headers["x-customer-id"];
    return this.cartService.getCart(customerId);
  }

  @Post("items")
  addToCart(@Body() addToCartDto: AddToCartDto, @Request() req: unknown) {
    const customerId = (req as any).headers["x-customer-id"];
    return this.cartService.addToCart(customerId, addToCartDto);
  }

  @Delete("items/:productId")
  removeFromCart(@Param("productId") productId: string, @Request() req: unknown) {
    const customerId = (req as any).headers["x-customer-id"];
    return this.cartService.removeFromCart(customerId, productId);
  }

  @Delete()
  clearCart(@Request() req: unknown) {
    const customerId = (req as any).headers["x-customer-id"];
    return this.cartService.clearCart(customerId);
  }
}
