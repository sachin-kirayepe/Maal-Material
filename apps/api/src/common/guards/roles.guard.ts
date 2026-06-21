import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { JwtPayload } from "@constructos/types";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles or permissions are required, let the request proceed
    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as any as JwtPayload;

    if (!user) {
      throw new ForbiddenException("Access denied: User context missing");
    }

    // Super Admins automatically bypass all permissions and roles checks
    if (user!.role === "SUPER_ADMIN") {
      return true;
    }

    // 1. Role validation (if specified)
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user!.role);
      if (!hasRole) {
        throw new ForbiddenException(
          `Access denied: Requires one of these roles [${requiredRoles.join(", ")}]`,
        );
      }
    }

    // 2. Permission validation (if specified)
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every((permission) =>
        user!.permissions.includes(permission),
      );
      if (!hasPermission) {
        throw new ForbiddenException(
          `Access denied: Requires all of these permissions [${requiredPermissions.join(", ")}]`,
        );
      }
    }

    return true;
  }
}
