import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi configurada.");
}

const client = postgres(connectionString, {
  prepare: false,
  max: 1,
  connect_timeout: 10,
  idle_timeout: 20,
});

export const db = drizzle(client);