import { Controller, Post, Body, Req, Headers, BadRequestException } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { PaymentsService } from './payments.service';
import { PrismaService } from '@database/prisma.service';

@Controller('webhooks/razorpay')
export class WebhookController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async handleWebhook(@Headers('x-razorpay-signature') signature: string, @Body() body: any) {
    // In a real scenario, you'd use Razorpay's webhook signature validation
    // Here we'll process the payment.captured event
    if (body.event === 'payment.captured') {
      const payment = body.payload.payment.entity;
      
      // Look up invoice via notes
      const invoiceId = payment.notes?.invoiceId;
      const customerId = payment.notes?.customerId;

      if (invoiceId && customerId) {
        // Automatically mark invoice as paid via existing service
        await this.paymentsService.create({
          invoiceId: invoiceId,
          customerId: customerId,
          amount: payment.amount / 100, // convert back to INR
          paymentMethod: payment.method,
          referenceNumber: payment.id,
          notes: 'Paid via Razorpay Webhook',
        }, 'system');
      }
    }
    
    return { status: 'ok' };
  }
}
