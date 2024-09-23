import React from "react";
import {
  type DiscoverySources,
  DiscoverySourcesContext,
} from "#/migration-wizard/providers/DiscoverySources";

export function useDiscoverySources(): DiscoverySources.Context {
  const ctx = React.useContext(DiscoverySourcesContext);
  if (!ctx) {
    throw new Error(
      "useDiscoverySources must be used <DiscoverySourceProvider />"
    );
  }

  return ctx;
}
