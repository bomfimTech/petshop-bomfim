import type { Pet } from "@/shared/types/domain/pet";

const petPadrao: Pet = {
  id: 1,
  nome: "Rex",
  especie: "cachorro",
  dono: "Ana Silva",
  criadoEm: "10/01/2024",
};

export function criarPetFake(sobrescrever?: Partial<Pet>): Pet {
  return { ...petPadrao, ...sobrescrever };
}
