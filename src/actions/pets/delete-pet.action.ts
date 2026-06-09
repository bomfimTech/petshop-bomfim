import type { Pet } from "@/shared/types/domain/pet";

export async function deletePetAction(
  listaAtual: Pet[],
  id: number
): Promise<Pet[]> {
  const resposta = await fetch(`/api/pets/${id}`, { method: "DELETE" });
  if (!resposta.ok) throw new Error("Erro ao remover pet");
  return listaAtual.filter((p) => p.id !== id);
}
