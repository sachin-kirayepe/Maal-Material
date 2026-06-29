import { useAuthStore } from "@/stores/authStore";

/**
 * useTenantId — Returns the authenticated user's tenant ID.
 *
 * Eliminates ALL hardcoded "tenant-1", "tenant_123", "tenant_1" references.
 * Every page that needs a tenantId should use this hook instead of hardcoding.
 *
 * Returns empty string if user is not authenticated (pages should handle this
 * by showing empty states or redirecting to login).
 */
export function useTenantId(): string {
  const user = useAuthStore((state) => state.user);
  return user?.tenantId || "";
}
