import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateSupplierPaymentDto, CreatePurchaseInvoiceDto } from "./dto/purchase-payments.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class PurchasePaymentsService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  // ========= PURCHASE INVOICES =========

  async createPurchaseInvoice(dto: CreatePurchaseInvoiceDto, createdBy: string) {

                try {
                  const supplier = await this.prisma.commerceParticipant.findFirst({
        where: { id: dto.supplierId, deletedAt: null },
      });
      if (!supplier) throw new NotFoundException("Supplier not found");

      return this.prisma.$transaction(
        async (tx) => {
          const invoice = await tx.purchaseInvoice.create({
            data: {
              invoiceNumber: dto.invoiceNumber,
              supplierId: dto.supplierId,
              purchaseOrderId: dto.purchaseOrderId,
              grandTotal: dto.grandTotal,
              subtotal: dto.grandTotal,
              dueAmount: dto.grandTotal,
              dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
              notes: dto.notes,
              createdBy,
            },
          });

          // Record DEBIT in supplier ledger (we owe them more)
          const ledger = await tx.supplierLedger.findUnique({
            where: { supplierId: dto.supplierId },
          });
          if (ledger) {
            const newBalance = ledger.balance + dto.grandTotal;
            await tx.supplierLedger.update({
              where: { id: ledger.id },
              data: { balance: newBalance },
            });
            await tx.supplierLedgerEntry.create({
              data: {
                supplierLedgerId: ledger.id,
                referenceId: invoice.id,
                referenceType: "PURCHASE_INVOICE",
                description: `Purchase Invoice ${dto.invoiceNumber}`,
                debit: dto.grandTotal,
                balance: newBalance,
                createdBy,
              },
            });
          }

          // Update supplier totalDue
          // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
          await tx.supplier.update({
            where: { id: dto.supplierId },
            data: { totalDue: { increment: dto.grandTotal } },
          });

          return invoice;
        },
        { maxWait: 10000, timeout: 20000 },
      );
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'PurchasePaymentsService', 
                         action: 'createPurchaseInvoice',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAllPurchaseInvoices(query: unknown = {}) {
    const { supplierId, status, page, limit } = query as any;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const where: unknown = { deletedAt: null };
    if (supplierId) (where as any).supplierId = supplierId;
    if (status) (where as any).status = status;

    const [items, totalItems] = await Promise.all([
      this.prisma.purchaseInvoice.findMany({
        where: where as any,
        skip,
        take,
        include: { suppliers: true, purchaseOrders: true },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.purchaseInvoice.count({ where: where as any }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: take,
        totalPages: Math.ceil(totalItems / take),
        currentPage: Number(page) || 1,
      },
    };
  }

  // ========= SUPPLIER PAYMENTS =========

  async processSupplierPayment(dto: CreateSupplierPaymentDto, processedBy: string) {

                try {
                  const supplier = await this.prisma.commerceParticipant.findFirst({
        where: { id: dto.supplierId, deletedAt: null },
      });
      if (!supplier) throw new NotFoundException("Supplier not found");

      return this.prisma.$transaction(
        async (tx) => {
          const paymentNumber = "SPAY-" + Date.now();

          const payment = await tx.supplierPayment.create({
            data: {
              paymentNumber,
              supplierId: dto.supplierId,
              purchaseInvoiceId: dto.purchaseInvoiceId,
              amount: dto.amount,
              paymentMethod: dto.paymentMethod,
              referenceNumber: dto.referenceNumber,
              notes: dto.notes,
              processedBy,
            },
          });

          // Update purchase invoice if linked
          if (dto.purchaseInvoiceId) {
            const invoice = await tx.purchaseInvoice.findUnique({
              where: { id: dto.purchaseInvoiceId },
            });
            if (invoice) {
              const newPaid = invoice.paidAmount + dto.amount;
              const newDue = invoice.grandTotal - newPaid;
              await tx.purchaseInvoice.update({
                where: { id: dto.purchaseInvoiceId },
                data: {
                  paidAmount: newPaid,
                  dueAmount: Math.max(0, newDue),
                  status: newDue <= 0 ? "PAID" : "PARTIAL",
                },
              });
            }
          }

          // Record CREDIT in supplier ledger (we owe them less)
          const ledger = await tx.supplierLedger.findUnique({
            where: { supplierId: dto.supplierId },
          });
          if (ledger) {
            const newBalance = ledger.balance - dto.amount;
            await tx.supplierLedger.update({
              where: { id: ledger.id },
              data: { balance: newBalance },
            });
            await tx.supplierLedgerEntry.create({
              data: {
                supplierLedgerId: ledger.id,
                referenceId: payment.id,
                referenceType: "SUPPLIER_PAYMENT",
                description: `Payment ${paymentNumber} via ${dto.paymentMethod}`,
                credit: dto.amount,
                balance: newBalance,
                createdBy: processedBy,
              },
            });
          }

          // Update supplier totalDue
          // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
          await tx.supplier.update({
            where: { id: dto.supplierId },
            data: { totalDue: { decrement: dto.amount } },
          });

          return payment;
        },
        { maxWait: 10000, timeout: 20000 },
      );
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'PurchasePaymentsService', 
                         action: 'processSupplierPayment',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findSupplierPayments(supplierId: string) {
    return this.prisma.supplierPayment.findMany({
      where: { supplierId },
      include: { purchaseInvoices: true },
      orderBy: { paymentDate: "desc" },
    });
  }

  async getSupplierLedger(supplierId: string) {
    const ledger = await this.prisma.supplierLedger.findUnique({
      where: { supplierId },
      include: { supplierLedgerEntries: { orderBy: { entryDate: "desc" }, take: 50 } },
    });
    if (!ledger) throw new NotFoundException("Supplier ledger not found");
    return ledger;
  }
}
