/**
 * Testes do createPetAction — camada que cadastra pet via HTTP POST.
 *
 * global.fetch é reatribuído no beforeEach de cada teste.
 * O Jest isola arquivos automaticamente; restoreAllMocks no afterEach
 * limpa spies, mas quem protege o isolamento é a reatribuição no beforeEach.
 */
import { createPetAction } from "../create-pet.action";
import { criarPetFake } from "@/shared/testing/pet-factory";

describe("createPetAction", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const dados = { nome: "Rex", especie: "cachorro", dono: "Ana Silva" };

  test("deve enviar POST para /api/pets com header Content-Type e body JSON", async () => {
    // PREPARAR
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => criarPetFake({ id: 2, ...dados }),
    } as Response);
    const listaAtual = [criarPetFake({ id: 1 })];

    // AGIR
    await createPetAction(listaAtual, dados);

    // VERIFICAR
    expect(fetchMock).toHaveBeenCalledWith("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  });

  test("deve devolver a lista com o pet novo no fim", async () => {
    // PREPARAR
    const listaAtual = [criarPetFake({ id: 1, nome: "Bidu" })];
    const novoPet = criarPetFake({ id: 2, ...dados });
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => novoPet,
    } as Response);

    // AGIR
    const resultado = await createPetAction(listaAtual, dados);

    // VERIFICAR
    expect(resultado).toEqual([...listaAtual, novoPet]);
    expect(resultado[resultado.length - 1].id).toBe(2);
  });

  test("NÃO deve alterar a lista original", async () => {
    // PREPARAR
    const listaAtual = [criarPetFake({ id: 1 })];
    const copiaOriginal = [...listaAtual];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => criarPetFake({ id: 2, ...dados }),
    } as Response);

    // AGIR
    await createPetAction(listaAtual, dados);

    // VERIFICAR
    expect(listaAtual).toEqual(copiaOriginal);
  });

  test("deve lançar usando erro.mensagem quando a API devolver mensagem", async () => {
    // PREPARAR
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        mensagem: "Espécie inválida. Use: cachorro, gato, coelho, hamster",
      }),
    } as Response);

    // AGIR + VERIFICAR
    await expect(createPetAction([], dados)).rejects.toThrow("Espécie inválida");
  });

  test('deve cair no fallback "Erro ao criar pet" quando o corpo não trouxer mensagem', async () => {
    // PREPARAR
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);

    // AGIR + VERIFICAR
    await expect(createPetAction([], dados)).rejects.toThrow("Erro ao criar pet");
  });
});
