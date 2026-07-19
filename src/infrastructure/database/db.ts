import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString =
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "POSTGRES_URL ou DATABASE_URL não foi configurada.",
  );
}

const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client);