/**
 * Testes do deletePetAction — camada que remove pet via HTTP DELETE.
 *
 * global.fetch é reatribuído no beforeEach de cada teste.
 * O Jest isola arquivos automaticamente; restoreAllMocks no afterEach
 * limpa spies, mas quem protege o isolamento é a reatribuição no beforeEach.
 */
import { deletePetAction } from "../delete-pet.action";
import { criarPetFake } from "@/shared/testing/pet-factory";

describe("deletePetAction", () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("deve chamar DELETE /api/pets/${id} com o id na URL", async () => {
    // PREPARAR
    fetchMock.mockResolvedValue({
      ok: true,
    } as Response);
    const listaAtual = [criarPetFake({ id: 5 })];

    // AGIR
    await deletePetAction(listaAtual, 5);

    // VERIFICAR
    expect(fetchMock).toHaveBeenCalledWith("/api/pets/5", { method: "DELETE" });
  });

  test("deve devolver a lista sem o pet removido", async () => {
    // PREPARAR
    const pet1 = criarPetFake({ id: 1, nome: "Rex" });
    const pet2 = criarPetFake({ id: 2, nome: "Bidu" });
    const listaAtual = [pet1, pet2];
    fetchMock.mockResolvedValue({ ok: true } as Response);

    // AGIR
    const resultado = await deletePetAction(listaAtual, 1);

    // VERIFICAR
    expect(resultado).toEqual([pet2]);
  });

  test("NÃO deve alterar a lista original", async () => {
    // PREPARAR
    const listaAtual = [
      criarPetFake({ id: 1 }),
      criarPetFake({ id: 2 }),
    ];
    const copiaOriginal = [...listaAtual];
    fetchMock.mockResolvedValue({ ok: true } as Response);

    // AGIR
    await deletePetAction(listaAtual, 1);

    // VERIFICAR
    expect(listaAtual).toEqual(copiaOriginal);
  });

  test('deve lançar "Erro ao remover pet" quando a resposta não for ok', async () => {
    // PREPARAR
    fetchMock.mockResolvedValue({ ok: false } as Response);

    // AGIR + VERIFICAR
    await expect(deletePetAction([], 1)).rejects.toThrow("Erro ao remover pet");
  });

  test("deve devolver a lista intacta quando o id não estiver nela", async () => {
  // PREPARAR
  const listaAtual = [criarPetFake({ id: 1 }), criarPetFake({ id: 2 })];
  fetchMock.mockResolvedValue({ ok: true } as Response);

  // AGIR
  const resultado = await deletePetAction(listaAtual, 999); // id que não existe na lista

  // VERIFICAR
  expect(resultado).toEqual(listaAtual);
  expect(resultado).not.toBe(listaAtual);
});

});
