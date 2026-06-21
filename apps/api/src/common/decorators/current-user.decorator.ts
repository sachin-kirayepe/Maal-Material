import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JwtPayload } from "@constructos/types";

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as any as JwtPayload;

    return data ? user?.[data] : user;
  },
);
