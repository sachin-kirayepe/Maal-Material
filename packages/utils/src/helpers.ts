import { ApiResponse } from "@constructos/types";

/**
 * Format raw numbers to currency strings (INR by default for industrial construction fits, but fully adaptable)
 */
export function formatCurrency(amount: number, locale = "en-IN", currency = "INR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format standard ISO dates beautifully
 */
export function formatDate(date: string | Date, locale = "en-US"): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

/**
 * Clean helper to structure standard API responses
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: any,
): ApiResponse<T> {
  return {
    success,
    message,
    data,
    error: error
      ? {
          code: error.code || "INTERNAL_ERROR",
          message: error.message || "An unexpected error occurred",
          details: error.details,
        }
      : undefined,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Simple async delay for network mimicking
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Clean text truncation helper for descriptions
 */
export function truncate(str: string, length = 100): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}
