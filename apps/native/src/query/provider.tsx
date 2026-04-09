import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { appQueryClient } from "./query-client";

/**
 * Mounts the shared React Query client for the app tree.
 *
 * @param props Provider children.
 * @returns Query client provider wrapping the app subtree.
 */
export function AppQueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={appQueryClient}>{children}</QueryClientProvider>;
}
