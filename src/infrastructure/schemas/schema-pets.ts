import {
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const tabelaPets = pgTable("pets", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  especie: text("especie").notNull(),
  dono: text("dono").notNull(),
  raca: text("raca"),
  criadoEm: timestamp("criado_em", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
}).enableRLS();