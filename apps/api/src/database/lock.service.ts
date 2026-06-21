import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class LockService {
  /**
   * Acquires a pessimistic row-level lock (SELECT ... FOR UPDATE) on a specific table and ID.
   * This ensures that no other concurrent transaction can read or modify this row until the current transaction completes.
   *
   * @param tx The active transaction client
   * @param tableName The exact database table name (e.g., 'GeneralLedgerAccount')
   * @param id The ID of the record to lock
   */
  async acquireRowLock(tx: any, tableName: string, id: string): Promise<void> {
    // In PostgreSQL, table names are case-sensitive if quoted, but Prisma maps them cleanly.
    // Ensure we prevent SQL injection by strictly typing the table parameter if necessary.
    const safeTableName = tableName.replace(/[^a-zA-Z0-9_]/g, "");

    // Using raw query to execute the row lock within the current transaction scope
    await tx.$executeRawUnsafe(`SELECT id FROM "${safeTableName}" WHERE id = $1 FOR UPDATE;`, id);
  }
}
