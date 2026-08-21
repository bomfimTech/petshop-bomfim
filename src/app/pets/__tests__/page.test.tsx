/**
 * Testes da PetsPage — a tela que junta o formulário, a lista e os erros.
 *
 * O hook inteiro é mockado com função de fábrica: aqui não interessa
 * como o usePets busca os dados, e sim o que a tela faz com o que ele devolve.
 */
import { render, screen } from "@testing-library/react";
import PetsPage from "../page";
import { usePets } from "@/hooks/pets/use-pets";

jest.mock("@/hooks/pets/use-pets", () => ({
  usePets: jest.fn(),
}));

const usePetsMock = usePets as jest.Mock;

describe("PetsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve exibir o aviso de lista vazia quando não houver pets", () => {
    // PREPARAR — o hook devolve o estado completo, com a lista vazia
    usePetsMock.mockReturnValue({
      pets: [],
      carregando: false,
      salvando: false,
      erro: null,
      adicionarPet: jest.fn(),
      removerPet: jest.fn(),
    });

    // AGIR
    render(<PetsPage />);

    // VERIFICAR
    expect(screen.getByText("Nenhum pet cadastrado ainda.")).toBeInTheDocument();
  });
});