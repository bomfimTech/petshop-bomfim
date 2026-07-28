/**
 * Testes de INTEGRAÇÃO da rota DELETE /api/pets/[id].
 *
 * @jest-environment node
 *
 * Importamos DELETE de ../[id]/route, mas o teste mora em pets/__tests__/
 * (como id-route.test.ts) — não dentro de [id]/__tests__ — para evitar que
 * o Next varra um segmento dinâmico extra durante o build.
 *
 * Handler e use case rodam de verdade; só o repositório é mockado (R18).
 * Neste projeto, "pet não encontrado" também responde 400, não 404 —
 * é decisão do código, não engano do teste.
 */
import { NextRequest } from "next/server";
import { DELETE } from "../[id]/route";
import { repositorioPet } from "@/modules/pets/repositories/repositorio-pet";
import { criarPetFake } from "@/shared/testing/pet-factory";

jest.mock("@/modules/pets/repositories/repositorio-pet", () => ({
  repositorioPet: {
    buscarTodos: jest.fn(),
    buscarPorId: jest.fn(),
    salvar: jest.fn(),
    remover: jest.fn(),
  },
}));

const buscarPorIdMock = repositorioPet.buscarPorId as jest.Mock;
const removerMock = repositorioPet.remover as jest.Mock;

function requisicaoDelete() {
  return new NextRequest("http://localhost/api/pets/1", {
    method: "DELETE",
  });
}

describe("DELETE /api/pets/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buscarPorIdMock.mockResolvedValue(criarPetFake({ id: 1 }));
    removerMock.mockResolvedValue(undefined);
  });

  test("deve responder 200 com sucesso true quando o pet existir", async () => {
    // PREPARAR — mocks no beforeEach

    // AGIR
    const resposta = await DELETE(requisicaoDelete(), {
      params: Promise.resolve({ id: "1" }),
    });

    // VERIFICAR
    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual({ sucesso: true });
  });

  test("deve chamar repositorioPet.remover com o id numérico", async () => {
    // PREPARAR — pet existente mockado no beforeEach

    // AGIR
    await DELETE(requisicaoDelete(), {
      params: Promise.resolve({ id: "7" }),
    });

    // VERIFICAR
    expect(removerMock).toHaveBeenCalledWith(7);
  });

  test('deve responder 400 com mensagem "ID inválido." quando o id não for numérico', async () => {
    // PREPARAR — id inválido na URL

    // AGIR
    const resposta = await DELETE(requisicaoDelete(), {
      params: Promise.resolve({ id: "abc" }),
    });

    // VERIFICAR
    expect(resposta.status).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.mensagem).toBe("ID inválido.");
  });

  test('deve responder 400 com "Pet não encontrado." quando buscarPorId devolver null', async () => {
    // PREPARAR
    buscarPorIdMock.mockResolvedValue(null);

    // AGIR
    const resposta = await DELETE(requisicaoDelete(), {
      params: Promise.resolve({ id: "99" }),
    });

    // VERIFICAR
    expect(resposta.status).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.mensagem).toBe("Pet não encontrado.");
  });

  test("NÃO deve chamar remover quando o pet não existir", async () => {
    // PREPARAR
    buscarPorIdMock.mockResolvedValue(null);

    // AGIR
    await DELETE(requisicaoDelete(), {
      params: Promise.resolve({ id: "99" }),
    });

    // VERIFICAR
    expect(removerMock).not.toHaveBeenCalled();
  });

  test('deve cair no fallback "Erro ao remover pet" quando o valor lançado não for um Error', async () => {
    // PREPARAR
    removerMock.mockRejectedValue("falha opaca");

    // AGIR
    const resposta = await DELETE(requisicaoDelete(), {
      params: Promise.resolve({ id: "1" }),
    });

    // VERIFICAR
    expect(resposta.status).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.mensagem).toBe("Erro ao remover pet");
  });
});
