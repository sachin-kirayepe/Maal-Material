import { User } from "./user";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  permissions: string[];
  tenantId?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, "password">;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
