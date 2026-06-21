import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(createPaymentDto: CreatePaymentDto, userId: string) {

                try {
                  return this.prisma.$transaction(async (tx) => {
        // 1. Fetch Invoice
        const invoice = await tx.invoice.findUnique({
          where: { id: createPaymentDto.invoiceId },
        });

        if (!invoice) throw new NotFoundException("Invoice not found");

        // M-03 FIX: Guard against overpayment — cap payment at due amount
        if (createPaymentDto.amount <= 0) {
          throw new BadRequestException("Payment amount must be greater than zero");
        }
        if (invoice.dueAmount <= 0) {
          throw new BadRequestException("Invoice is already fully paid");
        }
        if (createPaymentDto.amount > invoice.dueAmount) {
          throw new BadRequestException(
            `Payment amount (${createPaymentDto.amount}) exceeds invoice due amount (${invoice.dueAmount}). Maximum allowed: ${invoice.dueAmount}`,
          );
        }

        // 2. Create Payment Record
        const payment = await tx.payment.create({
          data: {
            customerId: createPaymentDto.customerId,
            totalAmount: createPaymentDto.amount,
            paymentMethod: createPaymentDto.paymentMethod,
            referenceNumber: createPaymentDto.referenceNumber,
            notes: createPaymentDto.notes,
          },
        });

        // 3. Create Payment Transaction
        const transaction = await tx.paymentTransaction.create({
          data: {
            paymentId: payment.id,
            invoiceId: invoice.id,
            amountApplied: createPaymentDto.amount,
            collectedBy: userId,
          },
        });

        // 4. Update Invoice Totals & Status
        const newPaidAmount = invoice.paidAmount + createPaymentDto.amount;
        const newDueAmount = invoice.grandTotal - newPaidAmount;
        let newPaymentStatus = "PARTIAL";

        if (newDueAmount <= 0) {
          newPaymentStatus = "PAID";
        }

        await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount,
            paymentStatus: newPaymentStatus,
            status: newPaymentStatus === "PAID" ? "PAID" : invoice.status,
          },
        });

        // 5. Update Customer Total Due
        await tx.customer.update({
          where: { id: createPaymentDto.customerId },
          data: {
            totalDue: { decrement: createPaymentDto.amount },
          },
        });

        return transaction;
      });
                } finally {
                  try {
                     // M-09 FIX: Scope broadcast to relevant tenant
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('payments', 'module.updated', { 
                         entity: 'PaymentsService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll(params: { skip?: number; take?: number; invoiceId?: string; customerId?: string }) {
    const { skip = 0, take = 10, invoiceId, customerId } = params;

    const where = {
      ...(invoiceId && { invoiceId }),
      ...(customerId && { payment: { customerId } }),
    };

    const [items, total] = await Promise.all([
      this.prisma.paymentTransaction.findMany({
        where,
        skip: Number(skip),
        take: Number(take),
        include: {
          payments: true,
          invoices: { select: { invoiceNumber: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.paymentTransaction.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        lastPage: Math.ceil(total / take),
      },
    };
  }
}
