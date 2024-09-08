import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { mix } from "./hacks/vite-plugin-mix";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    mix({
      handler: "./src/tests/_MockServer.ts",
    }),
  ],
});
