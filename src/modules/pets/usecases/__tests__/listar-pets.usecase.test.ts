/**
 * Testes do listarPetsUseCase — camada de REGRAS DE NEGÓCIO para listagem.
 *
 * O repositório é mockado porque a listagem lê do PostgreSQL.
 * Este use case apenas repassa a lista — não há validações próprias.
 */
import { listarPetsUseCase } from "../listar-pets.usecase";
import { repositorioPet } from "../../repositories/repositorio-pet";

jest.mock("../../repositories/repositorio-pet", () => ({
  repositorioPet: { buscarTodos: jest.fn() },
}));

const buscarTodosMock = repositorioPet.buscarTodos as jest.Mock;

describe("listarPetsUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve repassar a lista retornada pelo repositório", async () => {
    // PREPARAR
    const lista = [
      { id: 1, nome: "Rex", especie: "cachorro", dono: "Ana", criadoEm: "10/01/2024" },
    ];
    buscarTodosMock.mockResolvedValue(lista);

    // AGIR
    const resultado = await listarPetsUseCase();

    // VERIFICAR
    expect(buscarTodosMock).toHaveBeenCalled();
    expect(resultado).toEqual(lista);
  });

  test("deve devolver lista vazia quando não houver pets cadastrados", async () => {
    // PREPARAR
    buscarTodosMock.mockResolvedValue([]);

    // AGIR
    const resultado = await listarPetsUseCase();

    // VERIFICAR
    expect(resultado).toEqual([]);
  });

  // Tarefa 3 — O banco é consultado uma vez só
  test("deve consultar o repositório exatamente uma vez", async () => {
    // PREPARAR
    buscarTodosMock.mockResolvedValue([]);

    // AGIR
    await listarPetsUseCase();

    // VERIFICAR
    expect(buscarTodosMock).toHaveBeenCalledTimes(1);
  });

  test("deve devolver a mesma lista do repositório, sem copiar", async () => {
    // PREPARAR
    const lista = [
        { id: 1, nome: "Rex", especie: "cachorro", dono: "Ana", criadoEm: "10/01/2024" },
    ];
    buscarTodosMock.mockResolvedValue(lista);

    // AGIR
    const resultado = await listarPetsUseCase();

    // VERIFICAR — exige a MESMA referência, não só o mesmo conteúdo
    expect(resultado).toBe(lista);
});

});
