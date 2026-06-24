import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import { PrismaService } from '@database/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class GatewayService {
  private razorpay: any;
  private readonly logger = new Logger(GatewayService.name);

  constructor(private prisma: PrismaService) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === 'dummy_key') {
      this.logger.error('CRITICAL: Razorpay keys are missing or set to dummy values in production. Payments will fail!');
    }

    this.razorpay = new Razorpay({
      key_id: keyId || 'dummy_key',
      key_secret: keySecret || 'dummy_secret',
    });
  }

  async createOrder(amount: number, receiptId: string, notes: any = {}) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId || keyId === 'dummy_key') {
      throw new InternalServerErrorException('Payment Gateway is not configured. Cannot create live order.');
    }

    try {
      // Amount must be in subunits (Paise)
      const amountInPaise = Math.round(amount * 100);
      
      const order = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: notes,
      });
      return order;
    } catch (error: any) {
      this.logger.error(`Razorpay Create Order Failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException(`Razorpay Error: ${error.message}`);
    }
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || secret === 'dummy_secret') {
      this.logger.error('CRITICAL: Cannot verify payment signature without real Razorpay Secret.');
      return false;
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  }
}
