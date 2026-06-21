import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class WhatsappCommerceService {
  private readonly logger = new Logger(WhatsappCommerceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initiates a workflow and sends a real WhatsApp via Meta Cloud API.
   */
  async initiateWorkflow(
    tenantId: string,
    shopId: string,
    phoneNumber: string,
    workflowType: string,
    _referenceId: string,
    contextData: unknown,
  ) {
    this.logger.log(`Initiating real WhatsApp workflow '${workflowType}' for ${phoneNumber}`);

    // Save state in our database first
    const workflow = await this.prisma.whatsAppWorkflow.create({
      data: {
        tenantId,
        shopId,
        phoneNumber,
        workflowType,
        status: "SENT",
        contextPayload: JSON.stringify(contextData),
      },
    });

    // Invoke Meta Cloud API
    try {
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
      const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

      if (!accessToken || !phoneId) {
        this.logger.warn("WhatsApp API credentials are missing. Simulating sending message...");
        return workflow;
      }

      // Format payload for Meta API
      const messagePayload = this.buildMetaPayload(phoneNumber, workflowType, contextData);

      const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        this.logger.error("Meta API Error:", errorData);
        throw new Error("Failed to send WhatsApp via Meta API");
      }

      const responseData = await response.json();
      this.logger.log(
        `Successfully sent WhatsApp message. Meta ID: ${responseData.messages?.[0]?.id}`,
      );

      return workflow;
    } catch (err: unknown) {
      this.logger.error(`Failed to execute real WhatsApp API integration: ${(err as any).message}`);
      // Update state to FAILED
      await this.prisma.whatsAppWorkflow.update({
        where: { id: workflow.id },
        data: { status: "FAILED" },
      });
      throw err;
    }
  }

  private buildMetaPayload(phoneNumber: string, workflowType: string, contextData: unknown) {
    // Basic fallback to standard text if templates aren't fully configured
    let bodyText = `Hello from Maal-Material!\\n`;
    if (workflowType === "QUOTATION") {
      bodyText += `Your requested quotation is ready. Total Amount: â‚¹${(contextData as any)?.amount || 0}.\\nReply YES to approve, or NO to reject.`;
    } else if (workflowType === "INVOICE") {
      bodyText += `Your invoice has been generated for â‚¹${(contextData as any)?.amount || 0}.\\nThank you for doing business with us!`;
    }

    return {
      messaging_product: "whatsapp",
      to: phoneNumber.replace("+", ""), // Meta requires numbers without the +
      type: "text",
      text: {
        body: bodyText,
      },
    };
  }

  /**
   * Processes an incoming WhatsApp webhook from Meta.
   */
  async handleCustomerReply(phoneNumber: string, replyMessage: string) {
    this.logger.log(`Handling real customer reply from ${phoneNumber}: ${replyMessage}`);

    // Find the most recent active workflow for this phone number
    const workflow = await this.prisma.whatsAppWorkflow.findFirst({
      where: {
        phoneNumber: { contains: phoneNumber }, // Match partial due to + prefix differences
        status: { in: ["SENT", "DELIVERED", "READ"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!workflow) {
      this.logger.warn(`No active workflow found for ${phoneNumber}`);
      return null;
    }

    // Basic state machine logic
    let newStatus = "REPLIED";
    const newContext = JSON.parse(workflow.contextPayload || "{}");

    const lowerReply = replyMessage.toLowerCase().trim();

    if (workflow.workflowType === "QUOTATION") {
      if (lowerReply === "yes" || lowerReply === "accept") {
        newStatus = "COMPLETED";
        newContext.approved = true;
      } else if (lowerReply === "no" || lowerReply === "reject") {
        newStatus = "COMPLETED";
        newContext.approved = false;
      }
    }

    const updatedWorkflow = await this.prisma.whatsAppWorkflow.update({
      where: { id: workflow.id },
      data: {
        status: newStatus,
        contextPayload: JSON.stringify(newContext),
      },
    });

    // Optionally send an acknowledgment back via Meta API
    // ...

    return updatedWorkflow;
  }

  async getWorkflows(tenantId: string) {
    return this.prisma.whatsAppWorkflow.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
  }
}
