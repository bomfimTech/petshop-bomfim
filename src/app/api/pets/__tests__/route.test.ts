/**
 * Testes de INTEGRAÇÃO da rota GET/POST /api/pets.
 *
 * @jest-environment node
 *
 * Handler e use case rodam de verdade — só o repositório é mockado (R18).
 * Este arquivo fica em app/api/pets/__tests__/ e não dentro de [id], para
 * evitar que o Next varra um segmento dinâmico extra durante o build.
 *
 * Neste projeto, erros de negócio (incluindo validação) respondem 400 —
 * não 404. Isso é decisão do código, não engano do teste.
 */
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
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

const buscarTodosMock = repositorioPet.buscarTodos as jest.Mock;
const salvarMock = repositorioPet.salvar as jest.Mock;

function requisicaoPost(corpo: unknown) {
  return new NextRequest("http://localhost/api/pets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
}

describe("GET /api/pets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve responder 200 com a lista vinda do domínio", async () => {
    // PREPARAR
    const lista = [criarPetFake({ id: 1, nome: "Rex" })];
    buscarTodosMock.mockResolvedValue(lista);

    // AGIR
    const resposta = await GET();

    // VERIFICAR
    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual(lista);
  });
});

describe("POST /api/pets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    salvarMock.mockImplementation(async (dados) => ({
      id: 1,
      ...dados,
      criadoEm: "10/01/2024",
    }));
  });

  test("deve responder 201 com o pet criado", async () => {
    // PREPARAR
    const corpo = { nome: "Rex", especie: "cachorro", dono: "Ana Silva" };

    // AGIR
    const resposta = await POST(requisicaoPost(corpo));

    // VERIFICAR
    expect(resposta.status).toBe(201);
    const pet = await resposta.json();
    expect(pet.nome).toBe("Rex");
    expect(pet.id).toBe(1);
  });

  test("deve normalizar os dados sujos ao longo do caminho até o banco", async () => {
    // PREPARAR
    // Integração de verdade: rota → handler → use case → repositório mockado.
    // Este teste prova que cada camada faz sua parte — a rota não normaliza,
    // o handler capitaliza e faz trim, o use case valida, e só então salvar é chamado.
    const corpoSujo = {
      nome: "  rEX  ",
      especie: " CACHORRO ",
      dono: "  Ana Silva  ",
    };

    // AGIR
    await POST(requisicaoPost(corpoSujo));

    // VERIFICAR
    expect(salvarMock).toHaveBeenCalledWith({
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
    });
  });

  test("deve responder 400 com mensagem quando a espécie for inválida", async () => {
    // PREPARAR
    const corpo = { nome: "Rex", especie: "dragao", dono: "Ana Silva" };

    // AGIR
    const resposta = await POST(requisicaoPost(corpo));

    // VERIFICAR
    expect(resposta.status).toBe(400);
    const corpoErro = await resposta.json();
    expect(corpoErro.mensagem).toContain("Espécie inválida");
  });

  test("deve responder 400 quando o nome tiver menos de 2 letras", async () => {
    // PREPARAR
    const corpo = { nome: "R", especie: "cachorro", dono: "Ana Silva" };

    // AGIR
    const resposta = await POST(requisicaoPost(corpo));

    // VERIFICAR
    expect(resposta.status).toBe(400);
    const corpoErro = await resposta.json();
    expect(corpoErro.mensagem).toContain("ao menos 2 letras");
  });

  test("NÃO deve chamar salvar quando os dados forem inválidos", async () => {
    // PREPARAR
    const corpo = { nome: "Rex", especie: "dragao", dono: "Ana Silva" };

    // AGIR
    await POST(requisicaoPost(corpo));

    // VERIFICAR
    expect(salvarMock).not.toHaveBeenCalled();
  });

  test('deve cair no fallback "Erro ao criar pet" quando o valor lançado não for um Error', async () => {
    // PREPARAR
    salvarMock.mockRejectedValue("falha opaca");
    const corpo = { nome: "Rex", especie: "cachorro", dono: "Ana Silva" };

    // AGIR
    const resposta = await POST(requisicaoPost(corpo));

    // VERIFICAR
    expect(resposta.status).toBe(400);
    const corpoErro = await resposta.json();
    expect(corpoErro.mensagem).toBe("Erro ao criar pet");
  });
});
