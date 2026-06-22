import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Razorpay from 'razorpay';
import { PrismaService } from '@database/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class GatewayService {
  private razorpay: any;

  constructor(private prisma: PrismaService) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });
  }

  async createOrder(amount: number, receiptId: string, notes: any = {}) {
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
    } catch (error) {
      throw new InternalServerErrorException(`Razorpay Error: ${error.message}`);
    }
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  }
}
