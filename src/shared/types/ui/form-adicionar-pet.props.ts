import type { CriarPetDto } from "@/modules/pets/dto/criar-pet.dto";

export interface FormAdicionarPetProps {
  onSubmit: (dados: CriarPetDto) => void;
  salvando?: boolean;
}
