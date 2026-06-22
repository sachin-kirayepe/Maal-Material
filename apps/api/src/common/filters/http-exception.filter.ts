import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { correlationContext } from "../context/correlation.context";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";
    let code = "ERR_INTERNAL";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === "string" ? res : (res as any).message || exception.message;
      code = (res as any).error || "ERR_HTTP";
    } else if (exception instanceof Error) {
      message = exception.message;
      code = exception.name;
    }

    const ctxStore = correlationContext.getStore();
    const correlationId = ctxStore?.correlationId || "N/A";
    const cidPrefix = ctxStore ? `[CID: ${correlationId}] ` : "";

    // Log the full exception for audit purposes
    this.logger.error(
      `${cidPrefix}[${request.method}] ${request.url} - ${status} - ${code} - ${message}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      success: false,
      message,
      error: {
        code,
        message,
        path: request.url,
      },
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
}
