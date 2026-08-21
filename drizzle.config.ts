import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.MIGRATION_DATABASE_URL ??
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Nenhuma variável de conexão com o banco foi configurada.",
  );
}

export default defineConfig({
  schema: "./src/infrastructure/schemas/schema-pets.ts",
  out: "./drizzle",
  dialect: "postgresql",

  dbCredentials: {
    url: databaseUrl,
  },
});