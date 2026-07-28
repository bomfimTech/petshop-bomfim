/**
 * Testes do usePets — hook que gerencia lista, carregamento e erros na tela.
 *
 * As três actions são mockadas (R18) porque aqui testamos apenas
 * como o hook reage aos estados — não queremos rede nem API real.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createPetAction } from "@/actions/pets/create-pet.action";
import { deletePetAction } from "@/actions/pets/delete-pet.action";
import { listPetsAction } from "@/actions/pets/list-pets.action";
import { usePets } from "../use-pets";
import { criarPetFake } from "@/shared/testing/pet-factory";
import type { Pet } from "@/shared/types/domain/pet";

jest.mock("@/actions/pets/list-pets.action", () => ({
  listPetsAction: jest.fn(),
}));

jest.mock("@/actions/pets/create-pet.action", () => ({
  createPetAction: jest.fn(),
}));

jest.mock("@/actions/pets/delete-pet.action", () => ({
  deletePetAction: jest.fn(),
}));

const listarMock = listPetsAction as jest.Mock;
const criarMock = createPetAction as jest.Mock;
const removerMock = deletePetAction as jest.Mock;

function Cobaia() {
  const { pets, carregando, salvando, erro, adicionarPet, removerPet } =
    usePets();

  if (carregando) {
    return <p>Carregando pets...</p>;
  }

  return (
    <div>
      {erro && <p role="alert">{erro}</p>}
      <ul>
        {pets.map((p) => (
          <li key={p.id}>{p.nome}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          adicionarPet({ nome: "Novo", especie: "gato", dono: "João Silva" })
        }
      >
        {salvando ? "Salvando..." : "Adicionar"}
      </button>
      <button type="button" onClick={() => removerPet(1)}>
        Remover
      </button>
    </div>
  );
}

describe("usePets", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    listarMock.mockResolvedValue([]);
  });

  test("deve exibir carregando no estado inicial", () => {
    // PREPARAR
    listarMock.mockReturnValue(new Promise(() => {}));

    // AGIR
    render(<Cobaia />);

    // VERIFICAR
    expect(screen.getByText("Carregando pets...")).toBeInTheDocument();
  });

  test("deve listar os pets quando a busca der certo", async () => {
    // PREPARAR
    listarMock.mockResolvedValue([
      criarPetFake({ id: 1, nome: "Rex" }),
      criarPetFake({ id: 2, nome: "Bidu" }),
    ]);

    // AGIR
    render(<Cobaia />);

    // VERIFICAR
    expect(await screen.findByText("Rex")).toBeInTheDocument();
    expect(screen.getByText("Bidu")).toBeInTheDocument();
  });

  test("deve exibir a mensagem de erro quando listPetsAction falhar", async () => {
    // PREPARAR
    listarMock.mockRejectedValue(new Error("Falha ao carregar os pets"));

    // AGIR
    render(<Cobaia />);

    // VERIFICAR
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Falha ao carregar"
    );
  });

  test('deve usar "Erro desconhecido" quando o valor lançado não for um Error', async () => {
    // PREPARAR
    listarMock.mockRejectedValue("falha opaca");

    // AGIR
    render(<Cobaia />);

    // VERIFICAR
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Erro desconhecido"
    );
  });

  test("deve atualizar a lista após adicionarPet", async () => {
    // PREPARAR
    const user = userEvent.setup();
    listarMock.mockResolvedValue([criarPetFake({ id: 1, nome: "Rex" })]);
    criarMock.mockResolvedValue([
      criarPetFake({ id: 1, nome: "Rex" }),
      criarPetFake({ id: 2, nome: "Novo" }),
    ]);

    // AGIR
    render(<Cobaia />);
    await screen.findByText("Rex");
    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    // VERIFICAR
    expect(await screen.findByText("Novo")).toBeInTheDocument();
  });

  test("deve exibir salvando durante o adicionarPet", async () => {
    // PREPARAR
    const user = userEvent.setup();
    listarMock.mockResolvedValue([]);
    let resolverCriacao!: (lista: Pet[]) => void;
    criarMock.mockReturnValue(
      new Promise((resolve) => {
        resolverCriacao = resolve;
      })
    );

    // AGIR
    render(<Cobaia />);
    await waitFor(() =>
      expect(screen.queryByText("Carregando pets...")).not.toBeInTheDocument()
    );
    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    // VERIFICAR
    expect(
      await screen.findByRole("button", { name: /salvando/i })
    ).toHaveTextContent("Salvando...");

    resolverCriacao([criarPetFake({ id: 2, nome: "Novo" })]);
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /adicionar/i })
      ).toBeInTheDocument()
    );
  });

  test("deve atualizar a lista após removerPet", async () => {
    // PREPARAR
    const user = userEvent.setup();
    listarMock.mockResolvedValue([
      criarPetFake({ id: 1, nome: "Rex" }),
      criarPetFake({ id: 2, nome: "Bidu" }),
    ]);
    removerMock.mockResolvedValue([criarPetFake({ id: 2, nome: "Bidu" })]);

    // AGIR
    render(<Cobaia />);
    await screen.findByText("Rex");
    await user.click(screen.getByRole("button", { name: /remover/i }));

    // VERIFICAR
    await waitFor(() =>
      expect(screen.queryByText("Rex")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Bidu")).toBeInTheDocument();
  });

  test("NÃO deve marcar salvando durante removerPet", async () => {
    // PREPARAR
    const user = userEvent.setup();
    listarMock.mockResolvedValue([criarPetFake({ id: 1, nome: "Rex" })]);
    let resolverRemocao!: (lista: Pet[]) => void;
    removerMock.mockReturnValue(
      new Promise((resolve) => {
        resolverRemocao = resolve;
      })
    );

    // AGIR
    render(<Cobaia />);
    await screen.findByText("Rex");
    await user.click(screen.getByRole("button", { name: /remover/i }));

    // VERIFICAR
    expect(
      screen.getByRole("button", { name: /^adicionar$/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /salvando/i })
    ).not.toBeInTheDocument();

    resolverRemocao([]);
    await waitFor(() =>
      expect(screen.queryByText("Rex")).not.toBeInTheDocument()
    );
  });

  test("deve exibir a mensagem de erro quando adicionarPet falhar", async () => {
    // PREPARAR
    const user = userEvent.setup();
    listarMock.mockResolvedValue([]);
    criarMock.mockRejectedValue(new Error("Espécie inválida"));

    // AGIR
    render(<Cobaia />);
    await waitFor(() =>
      expect(screen.queryByText("Carregando pets...")).not.toBeInTheDocument()
    );
    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    // VERIFICAR
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Espécie inválida"
    );
  });

  test('deve usar "Erro desconhecido" quando adicionarPet falhar com valor não-Error', async () => {
    // PREPARAR
    const user = userEvent.setup();
    listarMock.mockResolvedValue([]);
    criarMock.mockRejectedValue("pane geral");

    // AGIR
    render(<Cobaia />);
    await waitFor(() =>
      expect(screen.queryByText("Carregando pets...")).not.toBeInTheDocument()
    );
    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    // VERIFICAR
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Erro desconhecido"
    );
  });

  test("deve exibir a mensagem de erro quando removerPet falhar", async () => {
    // PREPARAR
    const user = userEvent.setup();
    listarMock.mockResolvedValue([criarPetFake({ id: 1, nome: "Rex" })]);
    removerMock.mockRejectedValue(new Error("Erro ao remover pet"));

    // AGIR
    render(<Cobaia />);
    await screen.findByText("Rex");
    await user.click(screen.getByRole("button", { name: /remover/i }));

    // VERIFICAR
    expect(await screen.findByRole("alert")).toHaveTextContent("Erro ao remover");
  });

  test('deve usar "Erro desconhecido" quando removerPet falhar com valor não-Error', async () => {
    // PREPARAR
    const user = userEvent.setup();
    listarMock.mockResolvedValue([criarPetFake({ id: 1, nome: "Rex" })]);
    removerMock.mockRejectedValue("pane geral");

    // AGIR
    render(<Cobaia />);
    await screen.findByText("Rex");
    await user.click(screen.getByRole("button", { name: /remover/i }));

    // VERIFICAR
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Erro desconhecido"
    );
  });
});
