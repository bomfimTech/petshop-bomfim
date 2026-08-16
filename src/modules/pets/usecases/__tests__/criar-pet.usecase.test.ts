/**
 * Testes do criarPetUseCase — camada de REGRAS DE NEGÓCIO.
 *
 * O repositório é mockado porque ele conversa com o PostgreSQL:
 * sem o mock, este teste tentaria abrir conexão com o banco de verdade.
 * Aqui verificamos apenas as validações e se o pet válido chega ao repositório.
 */
import { criarPetUseCase } from "../criar-pet.usecase";
import { repositorioPet } from "../../repositories/repositorio-pet";

jest.mock("../../repositories/repositorio-pet", () => ({
  repositorioPet: { salvar: jest.fn() },
}));

const salvarMock = repositorioPet.salvar as jest.Mock;

describe("criarPetUseCase", () => {
  const petValido = { nome: "Rex", especie: "cachorro", dono: "Ana Silva" };

  beforeEach(() => {
    jest.clearAllMocks();
    salvarMock.mockResolvedValue({
      id: 1,
      ...petValido,
      criadoEm: "10/01/2024",
    });
  });

  test("deve salvar o pet quando os dados forem válidos", async () => {
    // PREPARAR — petValido já definido no describe

    // AGIR
    const criado = await criarPetUseCase(petValido);

    // VERIFICAR
    expect(salvarMock).toHaveBeenCalledWith(petValido);
    expect(criado.id).toBe(1);
  });

  test("deve recusar quando nome, espécie ou dono estiverem ausentes", async () => {
    // PREPARAR
    const semNome = { ...petValido, nome: "" };

    // AGIR + VERIFICAR
    await expect(criarPetUseCase(semNome)).rejects.toThrow("obrigatórios");

    expect(salvarMock).not.toHaveBeenCalled();
  });

  test("deve recusar nome com menos de 2 letras", async () => {
    // PREPARAR
    const nomeCurto = { ...petValido, nome: "R" };

    // AGIR + VERIFICAR
    await expect(criarPetUseCase(nomeCurto)).rejects.toThrow("ao menos 2 letras");

    expect(salvarMock).not.toHaveBeenCalled();
  });

  test("deve recusar espécie fora da lista permitida", async () => {
    // PREPARAR
    const especieInvalida = { ...petValido, especie: "dragao" };

    // AGIR + VERIFICAR
    await expect(criarPetUseCase(especieInvalida)).rejects.toThrow("Espécie inválida");

    expect(salvarMock).not.toHaveBeenCalled();
  });

  test("deve recusar dono com menos de 3 caracteres", async () => {
    // PREPARAR
    const donoCurto = { ...petValido, dono: "An" };

    // AGIR + VERIFICAR
    await expect(criarPetUseCase(donoCurto)).rejects.toThrow("ao menos 3 caracteres");

    expect(salvarMock).not.toHaveBeenCalled();
  });

  test("NÃO deve tocar no banco quando os dados forem inválidos", async () => {
    // PREPARAR
    const invalido = { ...petValido, especie: "dragao" };

    // AGIR + VERIFICAR
    await expect(criarPetUseCase(invalido)).rejects.toThrow();

    expect(salvarMock).not.toHaveBeenCalled();
  });

  // Tarefa 1 — Nome com exatamente 2 letras é aceito
  test("deve aceitar nome com exatamente 2 letras", async () => {
    // PREPARAR
    const pet = { nome: "Bo", especie: "cachorro", dono: "Ana Silva" };

    // AGIR
    await criarPetUseCase(pet);

    // VERIFICAR
    expect(salvarMock).toHaveBeenCalledWith(pet);
  });
});
