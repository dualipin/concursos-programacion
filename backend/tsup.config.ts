import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  clean: true,
  format: ["cjs"], // o 'esm' si usas módulos ES
  sourcemap: true,
  dts: false,
  alias: {
    "@": "./src",
    config: "./src/config",
  },
})
