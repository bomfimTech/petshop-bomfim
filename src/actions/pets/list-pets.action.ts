import type { Pet } from "@/shared/types/domain/pet";

export async function listPetsAction(): Promise<Pet[]> {
  const resposta = await fetch("/api/pets");
  if (!resposta.ok) throw new Error("Erro ao buscar pets");
  return resposta.json();
}
