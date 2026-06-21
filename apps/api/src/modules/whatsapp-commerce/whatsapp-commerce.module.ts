import { Module } from "@nestjs/common";
import { WhatsappCommerceController } from "./whatsapp-commerce.controller";
import { WhatsappCommerceService } from "./whatsapp-commerce.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [WhatsappCommerceController],
  providers: [WhatsappCommerceService],
  exports: [WhatsappCommerceService],
})
export class WhatsappCommerceModule {}
