/**
 * Testes do repositorioPet — camada de ACESSO AO BANCO (Drizzle + PostgreSQL).
 *
 * O módulo db é mockado porque sem ele o teste tentaria conectar ao PostgreSQL.
 * formatarDataCriacao também é mockado para congelar a data (R11).
 * Aqui verificamos o mapeamento row → DTO e os argumentos enviados ao Drizzle.
 */
import { db } from "@/infrastructure/database/db";
import { repositorioPet } from "../repositorio-pet";

jest.mock("@/infrastructure/database/db", () => ({
  db: { select: jest.fn(), insert: jest.fn(), delete: jest.fn() },
}));

jest.mock("@/shared/utils/formatar-data", () => ({
  formatarDataCriacao: jest.fn(() => "10/01/2024"),
}));

const selectMock = db.select as jest.Mock;
const insertMock = db.insert as jest.Mock;
const deleteMock = db.delete as jest.Mock;

const dataFixa = new Date(2024, 0, 10);

const rowCompleta = {
  id: 1,
  nome: "Rex",
  especie: "cachorro",
  dono: "Ana Silva",
  raca: "Labrador",
  criadoEm: dataFixa,
};

describe("repositorioPet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buscarTodos", () => {
    test("deve mapear as linhas do banco para o DTO", async () => {
      // PREPARAR
      selectMock.mockReturnValue({
        from: jest.fn().mockResolvedValue([
          {
            id: 1,
            nome: "Rex",
            especie: "cachorro",
            dono: "Ana",
            raca: null,
            criadoEm: dataFixa,
          },
        ]),
      });

      // AGIR
      const [pet] = await repositorioPet.buscarTodos();

      // VERIFICAR
      expect(pet.criadoEm).toBe("10/01/2024");
      expect(pet.nome).toBe("Rex");
    });

    test("deve omitir raca no DTO quando a coluna vier nula", async () => {
      // PREPARAR
      selectMock.mockReturnValue({
        from: jest.fn().mockResolvedValue([
          {
            id: 1,
            nome: "Rex",
            especie: "cachorro",
            dono: "Ana",
            raca: null,
            criadoEm: dataFixa,
          },
        ]),
      });

      // AGIR
      const [pet] = await repositorioPet.buscarTodos();

      // VERIFICAR
      expect(pet).not.toHaveProperty("raca");
    });

    test("deve devolver lista vazia quando não houver pets no banco", async () => {
      // PREPARAR
      selectMock.mockReturnValue({
        from: jest.fn().mockResolvedValue([]),
      });

      // AGIR
      const resultado = await repositorioPet.buscarTodos();

      // VERIFICAR
      expect(resultado).toEqual([]);
    });

    test("deve repassar raca com espaços quando a coluna vier preenchida assim (R19)", async () => {
      // PREPARAR
      // Mapear não é higienizar — a limpeza de raca acontece no handler.
      // Se o banco tiver "  " gravado, o repositório devolve "  " no DTO.
      selectMock.mockReturnValue({
        from: jest.fn().mockResolvedValue([
          {
            id: 1,
            nome: "Rex",
            especie: "cachorro",
            dono: "Ana",
            raca: "  ",
            criadoEm: dataFixa,
          },
        ]),
      });

      // AGIR
      const [pet] = await repositorioPet.buscarTodos();

      // VERIFICAR
      expect(pet.raca).toBe("  ");
    });
  });

  describe("buscarPorId", () => {
    test("deve devolver o pet mapeado quando encontrar o id", async () => {
      // PREPARAR
      const whereMock = jest.fn().mockResolvedValue([rowCompleta]);
      selectMock.mockReturnValue({
        from: jest.fn().mockReturnValue({ where: whereMock }),
      });

      // AGIR
      const pet = await repositorioPet.buscarPorId(1);

      // VERIFICAR
      expect(whereMock).toHaveBeenCalled();
      expect(pet).toEqual({
        id: 1,
        nome: "Rex",
        especie: "cachorro",
        dono: "Ana Silva",
        raca: "Labrador",
        criadoEm: "10/01/2024",
      });
    });

    test("deve devolver null quando o id não existir no banco", async () => {
      // PREPARAR
      selectMock.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

      // AGIR
      const pet = await repositorioPet.buscarPorId(99);

      // VERIFICAR
      expect(pet).toBeNull();
    });
  });

  describe("salvar", () => {
    test("deve enviar nome, especie, dono e raca ao values do insert", async () => {
      // PREPARAR
      const valuesMock = jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([rowCompleta]),
      });
      insertMock.mockReturnValue({ values: valuesMock });
      const dados = {
        nome: "Rex",
        especie: "cachorro",
        dono: "Ana Silva",
        raca: "Labrador",
      };

      // AGIR
      await repositorioPet.salvar(dados);

      // VERIFICAR
      expect(valuesMock).toHaveBeenCalledWith({
        nome: "Rex",
        especie: "cachorro",
        dono: "Ana Silva",
        raca: "Labrador",
      });
    });

    test("deve devolver o pet mapeado após o insert", async () => {
      // PREPARAR
      insertMock.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([rowCompleta]),
        }),
      });
      const dados = {
        nome: "Rex",
        especie: "cachorro",
        dono: "Ana Silva",
        raca: "Labrador",
      };

      // AGIR
      const criado = await repositorioPet.salvar(dados);

      // VERIFICAR
      expect(criado.criadoEm).toBe("10/01/2024");
      expect(criado.id).toBe(1);
    });

    test("deve lançar erro quando o insert não retornar nenhuma linha", async () => {
      // PREPARAR
      insertMock.mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      });
      const dados = {
        nome: "Rex",
        especie: "cachorro",
        dono: "Ana Silva",
      };

      // AGIR + VERIFICAR
      await expect(repositorioPet.salvar(dados)).rejects.toThrow(
        "Não foi possível cadastrar"
      );
    });
  });

  describe("remover", () => {
    test("deve chamar delete com where filtrando pelo id", async () => {
      // PREPARAR
      const whereMock = jest.fn().mockResolvedValue(undefined);
      deleteMock.mockReturnValue({ where: whereMock });

      // AGIR
      await repositorioPet.remover(5);

      // VERIFICAR
      expect(deleteMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
    });
  });
});
