import { QueryClient } from "@tanstack/react-query";

/**
 * Shared React Query client for the native app.
 */
export const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep global defaults conservative. More aggressive caching should be
      // opted into per-query once the invalidation strategy is proven.
      gcTime: 1000 * 60 * 10,
      networkMode: "always",
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 0,
    },
    mutations: {
      networkMode: "always",
      retry: false,
    },
  },
});
