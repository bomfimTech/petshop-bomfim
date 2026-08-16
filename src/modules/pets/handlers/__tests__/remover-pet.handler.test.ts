/**
 * Testes do removerPetHandler — camada de ENTRADA do domínio para remoção.
 *
 * O use case é mockado porque aqui verificamos apenas se o handler
 * repassa o id recebido sem alterar a lógica de negócio.
 */
import { removerPetHandler } from "../remover-pet.handler";
import { removerPetUseCase } from "../../usecases/remover-pet.usecase";

jest.mock("../../usecases/remover-pet.usecase", () => ({
  removerPetUseCase: jest.fn(),
}));

const useCaseMock = removerPetUseCase as jest.Mock;

describe("removerPetHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCaseMock.mockResolvedValue(undefined);
  });

  test("deve repassar o id para o use case sem alterar", async () => {
    // PREPARAR — id fixo para o teste

    // AGIR
    await removerPetHandler(7);

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledWith(7);
    expect(useCaseMock).toHaveBeenCalledTimes(1);
  });

  // Tarefa 7 — Repasse puro do handler
  test("deve repassar o id ao use case exatamente uma vez", async () => {
    // AGIR
    await removerPetHandler(7);

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledWith(7);
    expect(useCaseMock).toHaveBeenCalledTimes(1);
  });
});
