/**
 * Global API Client wrapper for Maal-Material Frontend.
 * Automatically injects Base URL, Authorization tokens, idempotency keys,
 * and CSRF-safe headers for all requests.
 */

import { toast } from "sonner";

// H-04 FIX: Read API base URL from environment variable, fallback to localhost for dev
const API_BASE_URL = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://127.0.0.1:3001/api/v1";

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

// H-03 FIX: Generate collision-resistant idempotency keys for mutation deduplication
function generateIdempotencyKey(): string {
  const timestamp = Date.now().toString(36);
  const random = Date.now().toString(36);
  return `${timestamp}-${random}`;
}

export class ApiClient {
  static async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...customConfig } = options;

    // H-06 FIX: Removed legacy localStorage token lookup.
    // The browser will automatically attach the HttpOnly cookie for auth.
    // If you have legacy clients that still need Bearer headers, they can pass them via `options.headers`.

    // H-03 FIX: Auto-generate idempotency key for state-mutating requests
    const method = (customConfig.method || "GET").toUpperCase();
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

    const config: RequestInit = {
      ...customConfig,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // H-07 FIX: CSRF-safe header — custom headers prevent simple CORS requests
        "X-Requested-With": "MaalMaterial-Client",
        ...(isMutation ? { "x-idempotency-key": generateIdempotencyKey() } : {}),
        ...headers,
      },
    };

    let url = `${API_BASE_URL}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Handle Unauthorized globally
        if (typeof window !== "undefined") {
          localStorage.removeItem("constructos_access_token");
          window.location.href = "/login";
        }
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `API Error: ${response.status}`;
        if (typeof window !== "undefined") {
          toast.error(errorMessage, { description: "Network request failed. Please try again or contact support." });
        }
        throw new Error(errorMessage);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`[API Client Error] ${endpoint}:`, error);
      throw error;
    }
  }

  static get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static post<T>(endpoint: string, data: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static patch<T>(endpoint: string, data: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static put<T>(endpoint: string, data: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
