import type { CriarPetDto } from "@/modules/pets/dto/criar-pet.dto";
import type { Pet } from "@/shared/types/domain/pet";

export async function createPetAction(
  listaAtual: Pet[],
  dados: CriarPetDto
): Promise<Pet[]> {
  const resposta = await fetch("/api/pets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    const erro = await resposta.json();
    throw new Error(erro.mensagem ?? "Erro ao criar pet");
  }

  const novoPet: Pet = await resposta.json();
  return [...listaAtual, novoPet];
}
