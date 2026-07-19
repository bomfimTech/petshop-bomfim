import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "A variável de ambiente DATABASE_URL não foi configurada.",
  );
}

// O Transaction Pooler não suporta prepared statements.
const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client);