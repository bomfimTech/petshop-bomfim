import type { Pet } from "../../types/domain/pet";

export const PETS_MOCK: Pet[] = [
  {
    id: 1,
    nome: "Rex",
    especie: "cachorro",
    dono: "Ana",
    raca: "Labrador",
    criadoEm: "10/01/2024",
  },
  {
    id: 2,
    nome: "Mimi",
    especie: "gato",
    dono: "Bruno",
    criadoEm: "11/01/2024",
  },
  {
    id: 3,
    nome: "Bolinha",
    especie: "coelho",
    dono: "Carla",
    raca: "Angorá",
    criadoEm: "12/01/2024",
  },
];
