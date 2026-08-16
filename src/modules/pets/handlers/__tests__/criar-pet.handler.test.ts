/**
 * Testes do criarPetHandler — camada de NORMALIZAÇÃO de entrada.
 *
 * O use case é mockado porque aqui verificamos apenas como os dados
 * são limpos antes de chegar às regras de negócio — não queremos
 * executar validações nem tocar no repositório neste arquivo.
 */
import { criarPetHandler } from "../criar-pet.handler";
import { criarPetUseCase } from "../../usecases/criar-pet.usecase";

jest.mock("../../usecases/criar-pet.usecase", () => ({
  criarPetUseCase: jest.fn(),
}));

const useCaseMock = criarPetUseCase as jest.Mock;

describe("criarPetHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCaseMock.mockResolvedValue({ id: 1, nome: "Rex" });
  });

  test("deve capitalizar o nome e remover os espaços laterais", async () => {
    // PREPARAR
    const entrada = {
      nome: "  rEX  ",
      especie: "cachorro",
      dono: "Ana Silva",
    };

    // AGIR
    await criarPetHandler(entrada);

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ nome: "Rex" })
    );
  });

  test("deve converter a espécie para minúsculas e remover espaços", async () => {
    // PREPARAR
    const entrada = {
      nome: "Rex",
      especie: " CACHORRO ",
      dono: "Ana Silva",
    };

    // AGIR
    await criarPetHandler(entrada);

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ especie: "cachorro" })
    );
  });

  test("deve remover os espaços laterais do nome do dono", async () => {
    // PREPARAR
    const entrada = {
      nome: "Rex",
      especie: "cachorro",
      dono: "  Ana Silva  ",
    };

    // AGIR
    await criarPetHandler(entrada);

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ dono: "Ana Silva" })
    );
  });

  test("deve incluir a raça quando ela vier preenchida", async () => {
    // PREPARAR
    const entrada = {
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
      raca: "  Labrador  ",
    };

    // AGIR
    await criarPetHandler(entrada);

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ raca: "Labrador" })
    );
  });

  test("NÃO deve incluir o campo raça quando ela vier vazia", async () => {
    // PREPARAR
    const entrada = {
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
      raca: "",
    };

    // AGIR
    await criarPetHandler(entrada);

    // VERIFICAR
    const enviado = useCaseMock.mock.calls[0][0];
    expect(enviado).not.toHaveProperty("raca");
  });

  test("NÃO deve incluir o campo raça quando ela vier só com espaços", async () => {
    // PREPARAR
    // Protege contra regressão (R17): antes o handler incluía { raca: "" }.
    const entrada = {
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
      raca: "   ",
    };

    // AGIR
    await criarPetHandler(entrada);

    // VERIFICAR
    const enviado = useCaseMock.mock.calls[0][0];
    expect(enviado).not.toHaveProperty("raca");
  });

  test("deve repassar nome vazio quando o nome vier só com espaços", async () => {
    // PREPARAR
    // O handler não valida, só normaliza — barrar nome vazio é responsabilidade do use case.
    const entrada = {
      nome: "   ",
      especie: "cachorro",
      dono: "Ana Silva",
    };

    // AGIR
    await criarPetHandler(entrada);

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ nome: "" })
    );
  });

  test("deve chamar o use case exatamente uma vez", async () => {
    // PREPARAR
    const entrada = {
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
    };

    // AGIR
    await criarPetHandler(entrada);

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledTimes(1);
  });

  // Tarefa 4 — Nome de uma letra também é capitalizado
  test("deve capitalizar quando o nome tiver uma letra só", async () => {
    // AGIR
    await criarPetHandler({ nome: "r", especie: "cachorro", dono: "Ana Silva" });

    // VERIFICAR
    expect(useCaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ nome: "R" })
    );
  });
});
