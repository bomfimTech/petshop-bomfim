/**
 * Testes do CardPet — componente visual puro que exibe um pet na lista.
 *
 * Não há mocks: o componente só recebe props e renderiza HTML.
 * Verificamos o que o usuário vê na tela e se o botão Remover avisa o pai.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardPet } from "../CardPet";
import { criarPetFake } from "@/shared/testing/pet-factory";

describe("CardPet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve exibir nome, espécie, dono e data de cadastro do pet", () => {
    // PREPARAR
    const pet = criarPetFake({
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
      criadoEm: "10/01/2024",
    });

    // AGIR
    render(<CardPet pet={pet} onRemover={jest.fn()} />);

    // VERIFICAR
    expect(screen.getByText("Rex")).toBeInTheDocument();
    expect(screen.getByText(/cachorro/)).toBeInTheDocument();
    expect(screen.getByText(/Dono: Ana Silva/)).toBeInTheDocument();
    expect(screen.getByText(/Cadastrado em: 10\/01\/2024/)).toBeInTheDocument();
  });

  test("deve exibir a raça entre parênteses quando ela existir", () => {
    // PREPARAR
    const pet = criarPetFake({ raca: "Labrador" });

    // AGIR
    render(<CardPet pet={pet} onRemover={jest.fn()} />);

    // VERIFICAR
    expect(screen.getByText("(Labrador)")).toBeInTheDocument();
  });

  test("NÃO deve exibir parênteses com raça quando ela não existir", () => {
    // PREPARAR
    const pet = criarPetFake();

    // AGIR
    render(<CardPet pet={pet} onRemover={jest.fn()} />);

    // VERIFICAR
    expect(screen.queryByText(/\(.+\)/)).not.toBeInTheDocument();
  });

  test("deve avisar o pai com o id do pet ao clicar em Remover", async () => {
    // PREPARAR
    const user = userEvent.setup();
    const aoRemover = jest.fn();
    const pet = criarPetFake({ id: 7 });

    // AGIR
    render(<CardPet pet={pet} onRemover={aoRemover} />);
    await user.click(screen.getByRole("button", { name: /remover/i }));

    // VERIFICAR
    expect(aoRemover).toHaveBeenCalledWith(7);
  });

  // Tarefa 5 — A data de cadastro aparece no card
  test("deve exibir a data de cadastro do pet", () => {
    // PREPARAR + AGIR
    render(
      <CardPet pet={criarPetFake({ criadoEm: "25/12/2024" })} onRemover={jest.fn()} />
    );

    // VERIFICAR
    expect(screen.getByText(/25\/12\/2024/)).toBeInTheDocument();
  });

  test("NÃO deve avisar o pai enquanto ninguém clicar em Remover", () => {
// PREPARAR
const aoRemover = jest.fn();
// AGIR
render(<CardPet pet={criarPetFake()} onRemover={aoRemover} />);
// VERIFICAR
expect(aoRemover).not.toHaveBeenCalled();
});

});
