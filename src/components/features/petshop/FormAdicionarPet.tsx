"use client";

import type { FormAdicionarPetProps } from "@/shared/types/ui/form-adicionar-pet.props";
import { useState } from "react";

const ESPECIES = ["cachorro", "gato", "coelho", "hamster"] as const;

export function FormAdicionarPet({ onSubmit, salvando = false }: FormAdicionarPetProps) {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState<string>(ESPECIES[0]);
  const [dono, setDono] = useState("");
  const [raca, setRaca] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      nome,
      especie,
      dono,
      ...(raca.trim() ? { raca: raca.trim() } : {}),
    });

    setNome("");
    setEspecie(ESPECIES[0]);
    setDono("");
    setRaca("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold">Adicionar Pet</h2>

      <div className="mb-3">
        <label htmlFor="nome" className="mb-1 block text-sm font-medium text-slate-700">
          Nome do pet
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: Rex"
          required
          minLength={2}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="especie" className="mb-1 block text-sm font-medium text-slate-700">
          Espécie
        </label>
        <select
          id="especie"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {ESPECIES.map((esp) => (
            <option key={esp} value={esp}>
              {esp.charAt(0).toUpperCase() + esp.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="dono" className="mb-1 block text-sm font-medium text-slate-700">
          Dono
        </label>
        <input
          id="dono"
          type="text"
          value={dono}
          onChange={(e) => setDono(e.target.value)}
          placeholder="Ex: Ana Silva"
          required
          minLength={3}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="raca" className="mb-1 block text-sm font-medium text-slate-700">
          Raça <span className="text-slate-400">(opcional)</span>
        </label>
        <input
          id="raca"
          type="text"
          value={raca}
          onChange={(e) => setRaca(e.target.value)}
          placeholder="Ex: Labrador"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={salvando}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {salvando ? "Salvando..." : "+ Adicionar Pet"}
      </button>
    </form>
  );
}
