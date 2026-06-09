import { removerPetUseCase } from "../usecases/remover-pet.usecase";

export async function removerPetHandler(id: number): Promise<void> {
  await removerPetUseCase(id);
}
