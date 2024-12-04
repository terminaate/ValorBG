import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        prettier: false,
        svgo: true,
        titleProp: true,
        ref: true,
        svgoConfig: {
          plugins: [{ name: "removeViewBox", fn: () => null }],
        },
      },
    }),
  ],
  build: {
    outDir: "dist",
    minify: "terser",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        splashscreen: resolve(__dirname, "./splashscreen.html"),
      },
    },
  },
  base: "",
  server: {
    port: 1420,
  },
});
