import type { PetRespostaDto } from "../dto/pet-resposta.dto";
import { listarPetsUseCase } from "../usecases/listar-pets.usecase";

export async function listarPetsHandler(): Promise<PetRespostaDto[]> {
  return listarPetsUseCase();
}
