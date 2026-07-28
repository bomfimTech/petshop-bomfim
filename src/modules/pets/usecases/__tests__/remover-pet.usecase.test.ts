/**
 * Testes do removerPetUseCase — camada de REGRAS DE NEGÓCIO para remoção.
 *
 * O repositório é mockado para não depender do PostgreSQL.
 * Verificamos se a remoção só acontece quando o pet existe no banco.
 */
import { removerPetUseCase } from "../remover-pet.usecase";
import { repositorioPet } from "../../repositories/repositorio-pet";

jest.mock("../../repositories/repositorio-pet", () => ({
  repositorioPet: {
    buscarPorId: jest.fn(),
    remover: jest.fn(),
  },
}));

const buscarPorIdMock = repositorioPet.buscarPorId as jest.Mock;
const removerMock = repositorioPet.remover as jest.Mock;

describe("removerPetUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    buscarPorIdMock.mockResolvedValue({
      id: 1,
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
      criadoEm: "10/01/2024",
    });
    removerMock.mockResolvedValue(undefined);
  });

  test("deve remover o pet quando ele existir no banco", async () => {
    // PREPARAR — mocks configurados no beforeEach

    // AGIR
    await removerPetUseCase(1);

    // VERIFICAR
    expect(buscarPorIdMock).toHaveBeenCalledWith(1);
    expect(removerMock).toHaveBeenCalledWith(1);
  });

  test("deve recusar a remoção quando o pet não existir", async () => {
    // PREPARAR
    buscarPorIdMock.mockResolvedValue(null);

    // AGIR + VERIFICAR
    await expect(removerPetUseCase(99)).rejects.toThrow("não encontrado");
  });

  test("NÃO deve chamar remover quando o pet não existir", async () => {
    // PREPARAR
    buscarPorIdMock.mockResolvedValue(null);

    // AGIR
    await expect(removerPetUseCase(99)).rejects.toThrow();

    // VERIFICAR
    expect(removerMock).not.toHaveBeenCalled();
  });
});
