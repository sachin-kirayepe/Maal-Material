import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { AddToCartDto } from "./dto/cart.dto";

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(customerId: string) {
    const cart = await this.prisma.cart.upsert({
      where: { customerId },
      update: {},
      create: { customerId },
      include: {
        cartItems: {
          include: { products: true },
        },
      },
    });

    return cart;
  }

  async addToCart(customerId: string, addToCartDto: AddToCartDto) {
    const cart = await this.getCart(customerId);

    const product = await this.prisma.product.findUnique({
      where: { id: addToCartDto.productId },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    // Check if item exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: addToCartDto.productId,
        },
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + addToCartDto.quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: addToCartDto.productId,
          quantity: addToCartDto.quantity,
        },
      });
    }

    return this.calculateTotals(cart.id);
  }

  async removeFromCart(customerId: string, productId: string) {
    const cart = await this.getCart(customerId);

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    return this.calculateTotals(cart.id);
  }

  async clearCart(customerId: string) {
    const cart = await this.getCart(customerId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.calculateTotals(cart.id);
  }

  private async calculateTotals(cartId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { cartItems: { include: { products: true } } },
    });

    if (!cart) throw new NotFoundException("Cart not found");

    let subtotal = 0;
    cart.cartItems.forEach((item) => {
      // C-03 FIX: Use actual product pricing from database instead of hardcoded ₹100
      const price = item.products?.sellingPrice
        ?? item.products?.purchasePrice
        ?? 0;
      subtotal += price * item.quantity;
    });

    const taxAmount = subtotal * 0.18; // 18% tax assumption
    const grandTotal = subtotal + taxAmount;

    return this.prisma.cart.update({
      where: { id: cartId },
      data: { subtotal, taxAmount, grandTotal },
      include: { cartItems: { include: { products: true } } },
    });
  }
}
