import type { PetRespostaDto } from "../dto/pet-resposta.dto";
import { repositorioPet } from "../repositories/repositorio-pet";

export async function listarPetsUseCase(): Promise<PetRespostaDto[]> {
  return repositorioPet.buscarTodos();
}
