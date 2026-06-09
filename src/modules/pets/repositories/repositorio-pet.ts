import { db } from "@/infrastructure/database/db";
import { tabelaPets } from "@/infrastructure/schemas/schema-pets";
import { formatarDataCriacao } from "@/shared/utils/formatar-data";
import type { CriarPetDto } from "../dto/criar-pet.dto";
import type { PetRespostaDto } from "../dto/pet-resposta.dto";
import { eq } from "drizzle-orm";

type PetRow = typeof tabelaPets.$inferSelect;

function mapearPet(row: PetRow): PetRespostaDto {
  return {
    id: row.id,
    nome: row.nome,
    especie: row.especie,
    dono: row.dono,
    criadoEm: formatarDataCriacao(row.criadoEm),
    ...(row.raca ? { raca: row.raca } : {}),
  };
}

export const repositorioPet = {
  async buscarTodos(): Promise<PetRespostaDto[]> {
    const rows = await db.select().from(tabelaPets);
    return rows.map(mapearPet);
  },

  async buscarPorId(id: number): Promise<PetRespostaDto | null> {
    const [pet] = await db
      .select()
      .from(tabelaPets)
      .where(eq(tabelaPets.id, id));
    return pet ? mapearPet(pet) : null;
  },

  async salvar(dados: CriarPetDto): Promise<PetRespostaDto> {
    const [criado] = await db
      .insert(tabelaPets)
      .values({ ...dados, criadoEm: new Date().toISOString() })
      .returning();
    return mapearPet(criado);
  },

  async remover(id: number): Promise<void> {
    await db.delete(tabelaPets).where(eq(tabelaPets.id, id));
  },
};
