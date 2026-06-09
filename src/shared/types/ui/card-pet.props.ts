import type { Pet } from "../domain/pet";

export interface CardPetProps {
  pet: Pet;
  onRemover: (id: number) => void;
}
