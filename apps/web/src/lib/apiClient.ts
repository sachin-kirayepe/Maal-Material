/**
 * Maal-Material Enterprise API Client
 * Provides resilient fetch execution, automatic retries, and offline queuing.
 */

import { useSyncStore } from "../stores/syncStore";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const apiClient = {
  async fetch<T>(url: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        // Handle rate limiting (429) or temporary gateway timeouts (504/502)
        if ([429, 502, 503, 504].includes(response.status) && retryCount < MAX_RETRIES) {
          console.warn(
            `[API Client] Temporary failure ${response.status} on ${url}. Retrying ${retryCount + 1}/${MAX_RETRIES}...`,
          );
          await wait(RETRY_DELAY_MS * (retryCount + 1));
          return this.fetch<T>(url, options, retryCount + 1);
        }

        throw new ApiError(response.status, errorData.message || "API Request Failed", errorData);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        // Network error (offline or server completely down)
        if (retryCount < MAX_RETRIES) {
          console.warn(
            `[API Client] Network failure. Retrying ${retryCount + 1}/${MAX_RETRIES}...`,
          );
          await wait(RETRY_DELAY_MS * (retryCount + 1));
          return this.fetch<T>(url, options, retryCount + 1);
        }

        console.error("[API Client] Network Error: The server is unreachable or offline.");

        // INTERCEPT OFFLINE MUTATIONS AND QUEUE THEM
        const method = (options.method || "GET").toUpperCase();
        if (["POST", "PUT", "DELETE"].includes(method)) {
          // Do not queue sync API calls themselves to avoid infinite loops
          if (!url.includes("/api/v1/offline-sync")) {
            useSyncStore.getState().enqueueOperation({
              entityType: url, // For generic queuing, we map entityType to URL
              action: method as "CREATE" | "UPDATE" | "DELETE",
              payload: options.body ? JSON.parse(options.body as string) : {},
            });
            // Removing the dummy success bypass. Throwing error to UI.
            throw new Error("Network offline. Action queued for sync.");
          }
        }
      }
      throw error;
    }
  },

  get<T>(url: string, options?: RequestInit) {
    return this.fetch<T>(url, { ...options, method: "GET" });
  },

  post<T>(url: string, data: any, options?: RequestInit) {
    return this.fetch<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put<T>(url: string, data: any, options?: RequestInit) {
    return this.fetch<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete<T>(url: string, options?: RequestInit) {
    return this.fetch<T>(url, { ...options, method: "DELETE" });
  },
};
