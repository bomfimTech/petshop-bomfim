/**
 * Testes do formatarDataCriacao — função pura, nada é mockado.
 */
import { formatarDataCriacao } from "../formatar-data";

describe("formatarDataCriacao", () => {
  test("deve formatar a data no padrão brasileiro", () => {
    // PREPARAR — mês 0 = janeiro! O 12 é a hora, evita erro de fuso
    const data = new Date(2024, 0, 10, 12);

    // AGIR
    const resultado = formatarDataCriacao(data);

    // VERIFICAR
    expect(resultado).toBe("10/01/2024, 12:00");
  });

  test("deve devolver travessão quando a data for inválida", () => {
    const resultado = formatarDataCriacao("banana");

    expect(resultado).toBe("—");
  });
});
