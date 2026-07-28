/**
 * Testes do FormAdicionarPet — formulário de cadastro de pet.
 *
 * Não há mocks de camadas internas: testamos interação do usuário
 * com labels, inputs e o callback onSubmit que o componente pai recebe.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormAdicionarPet } from "../FormAdicionarPet";

describe("FormAdicionarPet", () => {
  const onSubmitMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve permitir digitar nos campos de texto", async () => {
    // PREPARAR
    const user = userEvent.setup();
    render(<FormAdicionarPet onSubmit={onSubmitMock} />);

    // AGIR
    await user.type(screen.getByLabelText("Nome do pet"), "Rex");
    await user.type(screen.getByLabelText("Dono"), "Ana Silva");

    // VERIFICAR
    expect(screen.getByLabelText("Nome do pet")).toHaveValue("Rex");
    expect(screen.getByLabelText("Dono")).toHaveValue("Ana Silva");
  });

  test("deve permitir selecionar a espécie", async () => {
    // PREPARAR
    const user = userEvent.setup();
    render(<FormAdicionarPet onSubmit={onSubmitMock} />);

    // AGIR
    await user.selectOptions(screen.getByLabelText("Espécie"), "gato");

    // VERIFICAR
    expect(screen.getByLabelText("Espécie")).toHaveValue("gato");
  });

  test("deve chamar onSubmit com o payload correto quando o formulário for enviado", async () => {
    // PREPARAR
    const user = userEvent.setup();
    render(<FormAdicionarPet onSubmit={onSubmitMock} />);

    // AGIR
    await user.type(screen.getByLabelText("Nome do pet"), "Rex");
    await user.selectOptions(screen.getByLabelText("Espécie"), "cachorro");
    await user.type(screen.getByLabelText("Dono"), "Ana Silva");
    await user.type(screen.getByLabelText("Raça (opcional)"), "Labrador");
    await user.click(screen.getByRole("button", { name: /adicionar pet/i }));

    // VERIFICAR
    expect(onSubmitMock).toHaveBeenCalledWith({
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
      raca: "Labrador",
    });
  });

  test("NÃO deve incluir raca no payload quando o campo vier vazio", async () => {
    // PREPARAR
    const user = userEvent.setup();
    render(<FormAdicionarPet onSubmit={onSubmitMock} />);

    // AGIR
    await user.type(screen.getByLabelText("Nome do pet"), "Rex");
    await user.type(screen.getByLabelText("Dono"), "Ana Silva");
    await user.click(screen.getByRole("button", { name: /adicionar pet/i }));

    // VERIFICAR
    const enviado = onSubmitMock.mock.calls[0][0];
    expect(enviado).toEqual({
      nome: "Rex",
      especie: "cachorro",
      dono: "Ana Silva",
    });
    expect(enviado).not.toHaveProperty("raca");
  });

  test("deve limpar os campos após o envio", async () => {
    // PREPARAR
    const user = userEvent.setup();
    render(<FormAdicionarPet onSubmit={onSubmitMock} />);

    // AGIR
    await user.type(screen.getByLabelText("Nome do pet"), "Rex");
    await user.selectOptions(screen.getByLabelText("Espécie"), "gato");
    await user.type(screen.getByLabelText("Dono"), "Ana Silva");
    await user.type(screen.getByLabelText("Raça (opcional)"), "Labrador");
    await user.click(screen.getByRole("button", { name: /adicionar pet/i }));

    // VERIFICAR
    expect(screen.getByLabelText("Nome do pet")).toHaveValue("");
    expect(screen.getByLabelText("Espécie")).toHaveValue("cachorro");
    expect(screen.getByLabelText("Dono")).toHaveValue("");
    expect(screen.getByLabelText("Raça (opcional)")).toHaveValue("");
  });

  test("deve desabilitar o botão e mostrar Salvando... quando salvando for true", () => {
    // PREPARAR
    render(<FormAdicionarPet onSubmit={onSubmitMock} salvando={true} />);

    // VERIFICAR
    const botao = screen.getByRole("button", { name: /salvando/i });
    expect(botao).toBeDisabled();
    expect(botao).toHaveTextContent("Salvando...");
  });
});
