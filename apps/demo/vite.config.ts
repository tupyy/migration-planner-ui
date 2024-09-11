import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import mix from "./hacks/VitePluginMix";

// https://vitejs.dev/config/
export default defineConfig((env) => {
  const plugins = [tsconfigPaths(), react()];
  switch (env.mode) {
    case "production":
      break;
    case "development":
      plugins.push(
        mix({
          handler: "./hacks/MockServer.ts",
        })
      );
      break;
    default:
      throw new Error(`unhandled env value: ${env}`);
  }

  return {
    plugins,
    server: {
      proxy: {
        "/planner": {
          target: "http://172.17.0.3:3443",
          changeOrigin: true,
          rewrite: (path): string => path.replace(/^\/planner/, ""),
        },
      },
    },
  };
});
