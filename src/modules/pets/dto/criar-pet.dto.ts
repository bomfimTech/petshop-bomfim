import type { Pet } from "@/shared/types/domain/pet";

export type CriarPetDto = Omit<Pet, "id" | "criadoEm">;
