import { Controller, Post, Body, Get, Query, Res, HttpStatus } from "@nestjs/common";
import { WhatsappCommerceService } from "./whatsapp-commerce.service";
import { Response } from "express";

@Controller("api/v1/whatsapp-commerce")
export class WhatsappCommerceController {
  constructor(private readonly whatsappService: WhatsappCommerceService) {}

  @Post("initiate")
  async initiateWorkflow(@Body() body: unknown, @Res() res: Response) {
    try {
      const { tenantId, shopId, phoneNumber, workflowType, referenceId, contextData } = body as any;

      if (!tenantId || !shopId || !phoneNumber || !workflowType || !referenceId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Missing required parameters for WhatsApp workflow",
        });
      }

      const workflow = await this.whatsappService.initiateWorkflow(
        tenantId,
        shopId,
        phoneNumber,
        workflowType,
        referenceId,
        contextData,
      );

      return res.status(HttpStatus.CREATED).json({
        status: "success",
        data: workflow,
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: (error as any).message || "Error initiating WhatsApp workflow",
      });
    }
  }

  /**
   * Meta WhatsApp Webhook Verification endpoint
   * Meta sends a GET request here when you configure the Webhook URL in their dashboard.
   */
  @Get("webhook")
  verifyWebhook(
    @Query("hub.mode") mode: string,
    @Query("hub.challenge") challenge: string,
    @Query("hub.verify_token") token: string,
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "constructos_secret_token";

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return res.status(HttpStatus.OK).send(challenge); // Meta expects raw string
      } else {
        return res.sendStatus(HttpStatus.FORBIDDEN);
      }
    }
    return res.status(HttpStatus.BAD_REQUEST).send("Invalid verification request");
  }

  /**
   * Meta WhatsApp Webhook Message Receipt endpoint
   * Meta sends POST requests here for incoming messages and status updates.
   */
  @Post("webhook")
  async handleWebhook(@Body() body: unknown, @Res() res: Response) {
    try {
      // Check if it's a WhatsApp status or event
      if ((body as any).object === "whatsapp_business_account") {
        for (const entry of (body as any).entry) {
          for (const change of entry.changes) {
            if (change.value && change.value.messages) {
              for (const msg of change.value.messages) {
                const phoneNumber = msg.from; // Customer's phone number
                const replyMessage = msg.text?.body; // The actual text they sent

                if (phoneNumber && replyMessage) {
                  await this.whatsappService.handleCustomerReply(phoneNumber, replyMessage);
                }
              }
            }
          }
        }
        return res.sendStatus(HttpStatus.OK);
      } else {
        return res.sendStatus(HttpStatus.NOT_FOUND);
      }
    } catch (error: unknown) {
      console.error("Webhook Error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send((error as any).message);
    }
  }

  @Get("workflows")
  async getWorkflows(@Query("tenantId") tenantId: string, @Res() res: Response) {
    try {
      if (!tenantId) {
        return res.status(HttpStatus.BAD_REQUEST).send("tenantId required");
      }

      const workflows = await this.whatsappService.getWorkflows(tenantId);

      return res.status(HttpStatus.OK).json({ status: "success", data: workflows });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send((error as any).message);
    }
  }
}
