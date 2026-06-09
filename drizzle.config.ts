import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infrastructure/schemas/schema-pets.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./petshop.db",
  },
});
