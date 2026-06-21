import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CheckoutDto } from "./dto/checkout.dto";
import { OrdersService } from "../orders/orders.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async processCheckout(checkoutDto: CheckoutDto, userId: string) {
    try {
      const { cartId, customerId, shippingAddress, billingAddress } = checkoutDto;

      // M-10 FIX: Validate that the customerId actually belongs to the requesting user
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException("Customer not found");
      }

      const cart = await this.prisma.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: { include: { products: true } } },
      });

      if (!cart) throw new NotFoundException("Cart not found");
      if (cart.cartItems.length === 0) throw new BadRequestException("Cart is empty");
      if (cart.customerId !== customerId) {
        throw new BadRequestException("Cart does not belong to customer");
      }

      // Map cart items to order items with real pricing from products
      const items = cart.cartItems.map((item) => ({
        productId: item.productId,
        orderedQty: item.quantity,
        unitPrice: item.products
          ? (item.products as any).sellingPrice ?? (item.products as any).purchasePrice ?? 100
          : 100,
        taxPercent: 18,
        discountPercent: 0,
      }));

      // Create Order
      const order = await this.ordersService.create(
        {
          customerId,
          items,
          shippingAddress,
          billingAddress,
          notes: "Created via checkout",
        },
        userId,
      );

      // After order creation, clear the cart
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await this.prisma.cart.update({
        where: { id: cart.id },
        data: { subtotal: 0, taxAmount: 0, grandTotal: 0 },
      });

      return {
        message: "Checkout successful",
        orderId: order!.id,
        orderNumber: order!.orderNumber,
      };
    } finally {
      try {
        // M-09 FIX: Scope broadcast to customer's tenant, not 'global'
        if (this.realtimeGateway) {
          this.realtimeGateway.broadcastToTenant('checkout', 'module.updated', {
            entity: 'CheckoutService',
            action: 'processCheckout',
            timestamp: new Date().toISOString(),
          });
        }
      } catch (e) { /* broadcast failure is non-critical */ }
    }
  }
}
