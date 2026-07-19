import { criarPetHandler } from "@/modules/pets/handlers/criar-pet.handler";
import { listarPetsHandler } from "@/modules/pets/handlers/listar-pets.handler";
import type { CriarPetDto } from "@/modules/pets/dto/criar-pet.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const pets = await listarPetsHandler();
  return NextResponse.json(pets);
}

export async function POST(req: NextRequest) {
  try {
    const dados: CriarPetDto = await req.json();
    const novoPet = await criarPetHandler(dados);
    return NextResponse.json(novoPet, { status: 201 });
  } catch (erro: unknown) {
    const mensagem =
      erro instanceof Error ? erro.message : "Erro ao criar pet";
    return NextResponse.json({ mensagem }, { status: 400 });
  }
}
