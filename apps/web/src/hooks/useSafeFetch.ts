import { useEffect, useState } from "react";

/**
 * useSafeFetch - P0 Frontend Remediation
 *
 * Prevents the "useEffect Avalanche" (Race Conditions) by automatically
 * attaching an AbortController to the fetch cycle. If the component unmounts
 * or the dependencies change before the fetch completes, the stale request
 * is mathematically aborted, preventing overlapping state updates in Zustand.
 *
 * @param fetcher A function that accepts an AbortSignal and returns a Promise.
 * @param dependencies Standard React useEffect dependency array.
 */
export function useSafeFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>, dependencies: any[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    fetcher(signal)
      .then((res) => {
        if (!signal.aborted) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted successfully to prevent race condition.");
        } else if (!signal.aborted) {
          setError(err);
        }
      })
      .finally(() => {
        if (!signal.aborted) {
          setLoading(false);
        }
      });

    // Cleanup function: Abort the fetch if the component unmounts or deps change
    return () => {
      controller.abort();
    };
  }, dependencies);

  return { data, loading, error };
}
