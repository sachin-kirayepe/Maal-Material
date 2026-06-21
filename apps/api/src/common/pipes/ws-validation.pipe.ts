import { Injectable, ValidationPipe, ValidationError } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

/**
 * Hardened validation pipe specifically designed for WebSocket Gateways.
 * Instead of throwing HTTP exceptions, it strictly throws WsExceptions
 * that can be caught by the WsExceptionFilter and sent back cleanly to the client.
 */
@Injectable()
export class WsValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true, // Automatically strip non-whitelisted properties
      forbidNonWhitelisted: true, // Reject payloads with extra unknown fields to prevent injection
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(
          (error) =>
            `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints || {}).join(", ")}`,
        );
        return new WsException({
          status: "error",
          message: messages.join("; "),
        });
      },
    });
  }
}
