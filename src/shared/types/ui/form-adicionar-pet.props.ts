import type { NovoPet } from "@/shared/types/domain/pet";

export interface FormAdicionarPetProps {
  onSubmit: (dados: NovoPet) => void;
  salvando?: boolean;
}
