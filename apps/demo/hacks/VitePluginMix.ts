import type { Plugin } from "vite";
import type { Adapter } from "vite-plugin-mix";
import * as mod from "vite-plugin-mix";

export const nodeAdapter = mod.nodeAdapter;
export const vercelAdapter = mod.vercelAdapter;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const mix = mod.default.default as (options: {
  handler: string;
  adapter?: Adapter;
}) => Plugin;
export default mix;
