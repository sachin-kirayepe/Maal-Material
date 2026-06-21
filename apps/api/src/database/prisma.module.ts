import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { TransactionService } from "./transaction.service";
import { LockService } from "./lock.service";

@Global()
@Module({
  providers: [PrismaService, TransactionService, LockService],
  exports: [PrismaService, TransactionService, LockService],
})
export class PrismaModule {}
