/**
 * Testes do listarPetsHandler — camada de ENTRADA do domínio para listagem.
 *
 * O use case é mockado porque aqui verificamos apenas se o handler
 * repassa a chamada e devolve a resposta sem alterar nada.
 */
import { listarPetsHandler } from "../listar-pets.handler";
import { listarPetsUseCase } from "../../usecases/listar-pets.usecase";

jest.mock("../../usecases/listar-pets.usecase", () => ({
  listarPetsUseCase: jest.fn(),
}));

const useCaseMock = listarPetsUseCase as jest.Mock;

describe("listarPetsHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve repassar a lista do use case sem alterar", async () => {
    // PREPARAR
    const lista = [
      { id: 1, nome: "Rex", especie: "cachorro", dono: "Ana", criadoEm: "10/01/2024" },
    ];
    useCaseMock.mockResolvedValue(lista);

    // AGIR
    const resultado = await listarPetsHandler();

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual(lista);
  });
});
