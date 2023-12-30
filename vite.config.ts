import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "vite_i18n_gen_resources_type",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["lodash-es", "chokidar", "glob"],
    },
  },
});
