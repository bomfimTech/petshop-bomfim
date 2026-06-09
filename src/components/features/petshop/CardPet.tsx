import type { CardPetProps } from "@/shared/types/ui/card-pet.props";

export function CardPet({ pet, onRemover }: CardPetProps) {
  return (
    <div className="mb-2 rounded-lg border border-slate-200 p-3">
      <p>
        <strong>{pet.nome}</strong> — {pet.especie}
        {pet.raca && (
          <span className="text-slate-500"> ({pet.raca})</span>
        )}
      </p>
      <p className="text-xs text-slate-500">
        Dono: {pet.dono} · Cadastrado em: {pet.criadoEm}
      </p>
      <button
        type="button"
        onClick={() => onRemover(pet.id)}
        className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
      >
        Remover
      </button>
    </div>
  );
}
