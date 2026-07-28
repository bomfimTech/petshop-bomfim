/**
 * Testes do listPetsAction — camada que busca pets via HTTP.
 *
 * global.fetch é reatribuído no beforeEach de cada teste.
 * O Jest isola arquivos automaticamente; restoreAllMocks no afterEach
 * limpa spies, mas quem protege o isolamento é a reatribuição no beforeEach.
 */
import { listPetsAction } from "../list-pets.action";
import { criarPetFake } from "@/shared/testing/pet-factory";

describe("listPetsAction", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("deve chamar GET /api/pets", async () => {
    // PREPARAR
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    // AGIR
    await listPetsAction();

    // VERIFICAR
    expect(fetchMock).toHaveBeenCalledWith("/api/pets");
  });

  test("deve devolver a lista vinda do corpo da resposta", async () => {
    // PREPARAR
    const lista = [criarPetFake({ id: 1, nome: "Rex" })];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => lista,
    } as Response);

    // AGIR
    const resultado = await listPetsAction();

    // VERIFICAR
    expect(resultado).toEqual(lista);
  });

  test('deve lançar "Erro ao buscar pets" quando a resposta não for ok', async () => {
    // PREPARAR
    fetchMock.mockResolvedValue({
      ok: false,
    } as Response);

    // AGIR + VERIFICAR
    await expect(listPetsAction()).rejects.toThrow("Erro ao buscar pets");
  });
});
