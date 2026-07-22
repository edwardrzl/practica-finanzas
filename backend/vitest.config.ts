import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Co-located: los tests viven al lado de lo que prueban.
    // Ver stack/testing.md § Estructura de archivos.
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
