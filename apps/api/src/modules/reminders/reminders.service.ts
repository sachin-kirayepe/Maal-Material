import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class RemindersService {
  constructor(private readonly db: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async scheduleReminder(data: {
    customerId: string;
    referenceId?: string;
    referenceType?: string;
    amountDue: number;
    dueDate: Date;
    scheduledFor: Date;
    channel?: string;
    messageTemplate?: string;
  }) {
    return this.db.reminder.create({
      data: {
        customerId: data.customerId,
        referenceId: data.referenceId,
        referenceType: data.referenceType,
        amountDue: data.amountDue,
        dueDate: data.dueDate,
        scheduledFor: data.scheduledFor,
        channel: data.channel || "WHATSAPP",
        messageTemplate: data.messageTemplate,
        status: "SCHEDULED",
      },
    });
  }

  async getUpcomingReminders() {
    return this.db.reminder.findMany({
      where: { status: "SCHEDULED", scheduledFor: { lte: new Date() } },
      include: { customers: true },
    });
  }

  async markAsSent(reminderId: string) {

                try {
                  return this.db.reminder.update({
        where: { id: reminderId },
        data: { status: "SENT", sentAt: new Date() },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'RemindersService', 
                         action: 'markAsSent',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
