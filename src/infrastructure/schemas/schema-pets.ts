import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tabelaPets = sqliteTable("pets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  especie: text("especie").notNull(),
  dono: text("dono").notNull(),
  raca: text("raca"),
  criadoEm: text("criado_em").notNull(),
});
