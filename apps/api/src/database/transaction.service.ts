import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/**
 * A utility service to wrap multiple operations inside a single Prisma interactive transaction.
 * Use this to guarantee ACID compliance for critical multi-table updates.
 */
@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Executes a callback within an interactive transaction.
   * If any error is thrown within the callback, all database operations are rolled back.
   *
   * @param work Callback containing the operations to perform. Use the provided `tx` client instead of `this.prisma`.
   */
  async execute<T>(
    work: (
      tx: Omit<
        PrismaService,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      // We cast the transaction client 'tx' to any here because Prisma's exact ITX type can be overly complex to export generically,
      // but inside the service, the developer will use it identically to this.prisma.
      return work(tx as any);
    });
  }
}
