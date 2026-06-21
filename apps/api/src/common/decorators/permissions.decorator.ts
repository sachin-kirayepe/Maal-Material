import { SetMetadata } from "@nestjs/common";
import { SystemPermission } from "@constructos/types";

export const PERMISSIONS_KEY = "permissions";
export const Permissions = (...permissions: (SystemPermission | string)[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
