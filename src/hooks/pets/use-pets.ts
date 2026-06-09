"use client";

import { createPetAction } from "@/actions/pets/create-pet.action";
import { deletePetAction } from "@/actions/pets/delete-pet.action";
import { listPetsAction } from "@/actions/pets/list-pets.action";
import type { CriarPetDto } from "@/modules/pets/dto/criar-pet.dto";
import type { Pet } from "@/shared/types/domain/pet";
import { useEffect, useState } from "react";

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  
  async function loadPets() {
    try {
      setCarregando(true);
      setErro(null);
      const lista = await listPetsAction();
      setPets(lista);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    async function init() {
      await loadPets();
    }

    void init();
  }, []);

  async function adicionarPet(dados: CriarPetDto) {
    try {
      setSalvando(true);
      setErro(null);
      const listaNova = await createPetAction(pets, dados);
      setPets(listaNova);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setSalvando(false);
    }
  }

  async function removerPet(id: number) {
    try {
      setErro(null);
      const listaNova = await deletePetAction(pets, id);
      setPets(listaNova);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido");
    }
  }

  return { pets, carregando, salvando, erro, adicionarPet, removerPet };
}
