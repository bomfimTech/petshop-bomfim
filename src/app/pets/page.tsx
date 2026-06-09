"use client";

import { CardPet } from "@/components/features/petshop/CardPet";
import { FormAdicionarPet } from "@/components/features/petshop/FormAdicionarPet";
import { usePets } from "@/hooks/pets/use-pets";

export default function PetsPage() {
  const { pets, carregando, salvando, erro, adicionarPet, removerPet } =
    usePets();

  if (carregando) return <p className="p-6">Carregando pets...</p>;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">🐾 Pets Cadastrados</h1>

      <FormAdicionarPet onSubmit={adicionarPet} salvando={salvando} />

      {erro && (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          Erro: {erro}
        </p>
      )}

      {pets.length === 0 ? (
        <p className="text-slate-500">Nenhum pet cadastrado ainda.</p>
      ) : (
        pets.map((p) => (
          <CardPet key={p.id} pet={p} onRemover={removerPet} />
        ))
      )}
    </main>
  );
}
