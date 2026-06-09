import type { CriarPetDto } from "../dto/criar-pet.dto";
import type { PetRespostaDto } from "../dto/pet-resposta.dto";
import { repositorioPet } from "../repositories/repositorio-pet";

const ESPECIES_VALIDAS = ["cachorro", "gato", "coelho", "hamster"];

export async function criarPetUseCase(
  dados: CriarPetDto
): Promise<PetRespostaDto> {
  if (!dados.nome || !dados.especie || !dados.dono) {
    throw new Error("Nome, espécie e dono são obrigatórios.");
  }

  if (dados.nome.length < 2) {
    throw new Error("Nome do pet deve ter ao menos 2 letras.");
  }

  if (!ESPECIES_VALIDAS.includes(dados.especie)) {
    throw new Error(
      `Espécie inválida. Use: ${ESPECIES_VALIDAS.join(", ")}`
    );
  }

  if (dados.dono.length < 3) {
    throw new Error("Nome do dono deve ter ao menos 3 caracteres.");
  }

  return repositorioPet.salvar(dados);
}
