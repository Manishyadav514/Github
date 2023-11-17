import { defineConfig, loadEnv } from "vite";
import solidPlugin from "vite-plugin-solid";
import * as path from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  loadEnv(mode, process.cwd(), "");
  return {
    plugins: [solidPlugin({ typescript: { onlyRemoveTypeImports: true } })],
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@constants": path.resolve(__dirname, "./src/constants"),
        "@types": path.resolve(__dirname, "./src/types")
      }
    },
    server: {
      port: 3000
    },
    preview: {
      port: 3000
    },
    build: {
      target: "esnext"
    },
    envDir: "env",
    envPrefix: "NUCLEUS_"
  };
});
