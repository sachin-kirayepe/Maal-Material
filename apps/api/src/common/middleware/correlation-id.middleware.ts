import { Injectable, NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { correlationContext } from "../context/correlation.context";
import { randomUUID } from "crypto";

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = (req.headers["x-correlation-id"] as string) || randomUUID();

    // Attach to response headers so client can track
    res.setHeader("x-correlation-id", correlationId);

    correlationContext.run({ correlationId }, () => {
      next();
    });
  }
}
