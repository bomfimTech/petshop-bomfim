import { removerPetHandler } from "@/modules/pets/handlers/remover-pet.handler";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const petId = Number(id);

    if (Number.isNaN(petId)) {
      return NextResponse.json(
        { mensagem: "ID inválido." },
        { status: 400 }
      );
    }

    await removerPetHandler(petId);
    return NextResponse.json({ sucesso: true });
  } catch (erro: unknown) {
    const mensagem =
      erro instanceof Error ? erro.message : "Erro ao remover pet";
    return NextResponse.json({ mensagem }, { status: 400 });
  }
}
