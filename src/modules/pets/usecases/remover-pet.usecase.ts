import { repositorioPet } from "../repositories/repositorio-pet";

export async function removerPetUseCase(id: number): Promise<void> {
  const pet = await repositorioPet.buscarPorId(id);

  if (!pet) {
    throw new Error("Pet não encontrado.");
  }

  await repositorioPet.remover(id);
}
