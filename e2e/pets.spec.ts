/**
 * Testes E2E do fluxo de pets em /pets — app, API e banco reais.
 *
 * Cada teste cria pets com nome único e limpa no afterEach.
 * workers: 1 no playwright.config evita corrida no banco compartilhado.
 */
import { test, expect, type Page } from "@playwright/test";

let nomeParaLimpar: string | null = null;

async function aguardarListaCarregar(page: Page) {
  await page.goto("/pets");
  await expect(page.getByText("Carregando pets...")).not.toBeVisible({
    timeout: 30_000,
  });
}

async function cadastrarPet(
  page: Page,
  nome: string,
  opcoes?: { especie?: string; raca?: string }
) {
  await aguardarListaCarregar(page);
  await page.getByLabel("Nome do pet").fill(nome);
  await page.getByLabel("Dono").fill("Ana Silva");
  await page.getByLabel("Espécie").selectOption(opcoes?.especie ?? "gato");
  if (opcoes?.raca) {
    await page.getByLabel("Raça (opcional)").fill(opcoes.raca);
  }
  await page.getByRole("button", { name: /adicionar pet/i }).click();
  await expect(page.getByText(nome, { exact: true })).toBeVisible();
}

function cardDoPet(page: Page, nome: string) {
  return page
    .getByText(nome, { exact: true })
    .locator("xpath=ancestor::div[1]");
}

test.afterEach(async ({ page }) => {
  if (!nomeParaLimpar) return;

  await aguardarListaCarregar(page);
  const card = cardDoPet(page, nomeParaLimpar);

  if (await card.isVisible()) {
    await card.getByRole("button", { name: "Remover" }).click();
    await expect(
      page.getByText(nomeParaLimpar, { exact: true })
    ).not.toBeVisible();
  }

  nomeParaLimpar = null;
});

test("usuário cadastra um pet e vê na lista com a raça", async ({ page }) => {
  // PREPARAR
  const nomeUnico = `Rex-e2e-${Date.now()}`;
  nomeParaLimpar = nomeUnico;

  // AGIR
  await aguardarListaCarregar(page);
  await page.getByLabel("Nome do pet").fill(nomeUnico);
  await page.getByLabel("Dono").fill("Ana Silva");
  await page.getByLabel("Espécie").selectOption("gato");
  await page.getByLabel("Raça (opcional)").fill("Persa");
  await page.getByRole("button", { name: /adicionar pet/i }).click();

  // VERIFICAR
  await expect(page.getByText(nomeUnico, { exact: true })).toBeVisible();
  await expect(page.getByText("(Persa)")).toBeVisible();
});

test("validação HTML bloqueia cadastro com nome de 1 letra", async ({
  page,
}) => {
  // PREPARAR
  // Quem barra aqui é a validação nativa do HTML (required + minLength),
  // antes de qualquer requisição — camada diferente das regras do use case.
  await aguardarListaCarregar(page);
  const campoNome = page.getByLabel("Nome do pet");

  // AGIR
  await campoNome.fill("R");
  await page.getByLabel("Dono").fill("Ana Silva");
  await page.getByRole("button", { name: /adicionar pet/i }).click();

  // VERIFICAR
  const invalido = await campoNome.evaluate(
    (el) => !(el as HTMLInputElement).validity.valid
  );
  expect(invalido).toBe(true);
  await expect(page.getByText("R", { exact: true })).not.toBeVisible();
});

test("usuário remove o pet que acabou de cadastrar", async ({ page }) => {
  // PREPARAR
  const nomeUnico = `Rex-e2e-${Date.now()}`;
  nomeParaLimpar = nomeUnico;
  await cadastrarPet(page, nomeUnico);

  // AGIR
  const card = cardDoPet(page, nomeUnico);
  await card.getByRole("button", { name: "Remover" }).click();

  // VERIFICAR
  await expect(page.getByText(nomeUnico, { exact: true })).not.toBeVisible();

  // Já removemos — evita limpeza duplicada no afterEach
  nomeParaLimpar = null;
});
