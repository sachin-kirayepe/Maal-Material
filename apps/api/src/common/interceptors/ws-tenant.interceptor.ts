import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { Socket } from "socket.io";

@Injectable()
export class WsTenantInterceptor implements NestInterceptor {
  private readonly logger = new Logger(WsTenantInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== "ws") {
      return next.handle();
    }

    const client: Socket = context.switchToWs().getClient();

    // In a real scenario, this would be extracted from the authenticated JWT token stored on client.data
    // Here we ensure it exists and enforce room isolation
    const tenantId = client.handshake.auth?.tenantId || client.data?.tenantId;

    if (tenantId) {
      const roomName = `tenant_${tenantId}`;
      if (!client.rooms.has(roomName)) {
        this.logger.debug(`Joining socket ${client.id} to isolated tenant room: ${roomName}`);
        client.join(roomName);
      }
    } else {
      this.logger.warn(
        `Socket ${client.id} connected without a tenantId. Isolating from tenant broadcasts.`,
      );
    }

    return next.handle();
  }
}
