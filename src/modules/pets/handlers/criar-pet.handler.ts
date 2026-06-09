import type { CriarPetDto } from "../dto/criar-pet.dto";
import type { PetRespostaDto } from "../dto/pet-resposta.dto";
import { criarPetUseCase } from "../usecases/criar-pet.usecase";

function capitalizarPrimeiraLetra(texto: string): string {
  if (!texto) return texto;
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

export async function criarPetHandler(dados: CriarPetDto): Promise<PetRespostaDto> {
  const dadosNormalizados: CriarPetDto = {
    nome: capitalizarPrimeiraLetra(dados.nome.trim()),
    especie: dados.especie.trim().toLowerCase(),
    dono: dados.dono.trim(),
    ...(dados.raca ? { raca: dados.raca.trim() } : {}),
  };

  return criarPetUseCase(dadosNormalizados);
}
