import { sql } from "drizzle-orm";

import { db } from "@/infrastructure/database/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resultado = await db.execute(sql`
      select
        current_database() as banco,
        current_user as usuario,
        to_regclass('public.pets')::text as tabela
    `);

    return Response.json({
      ok: true,
      resultado: [...resultado],
    });
  } catch (erro) {
    console.error("ERRO_DIAGNOSTICO_BANCO:", erro);

    return Response.json(
      {
        ok: false,
        erro:
          erro instanceof Error
            ? erro.message
            : "Erro desconhecido ao acessar o banco.",
      },
      { status: 500 },
    );
  }
}