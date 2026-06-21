import { Module, Global } from "@nestjs/common";
import { RbacService } from "./rbac.service";
import { RolesController } from "./roles.controller";
import { PermissionsController } from "./permissions.controller";
import { JwtModule } from "@nestjs/jwt";

@Global() // Make RbacService and components globally accessible to verify role mappings easily
@Module({
  imports: [JwtModule],
  controllers: [RolesController, PermissionsController],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
