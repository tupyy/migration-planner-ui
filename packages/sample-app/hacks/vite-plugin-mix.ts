import type { Plugin } from "vite";
import type { Adapter } from "vite-plugin-mix";
import mixPlugin from "vite-plugin-mix";

type MixConfig = {
  handler: string;
  adapter?: Adapter;
}

type MixPlugin = (config: MixConfig) => Plugin;

type Mix = {
  default: MixPlugin;
}

export const mix = (mixPlugin as unknown as Mix).default;
