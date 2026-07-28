# Guia de Testes — PetShop X4

Este documento é para quem **acabou de clonar o repositório** e quer entender como rodar, ler e escrever testes neste projeto.

---

## Como rodar

| Comando | O que faz |
|---|---|
| `npm test` | Roda toda a suíte Jest uma vez |
| `npm run test:watch` | Roda os testes em modo observação (reexecuta ao salvar) |
| `npm run test:cov` | Roda os testes e gera relatório de cobertura na pasta `coverage/` |
| `npm run test:e2e` | Roda os testes Playwright (navegador + app + banco reais) |

### O que precisa de configuração?

**Os 79 testes Jest rodam sem nenhuma configuração extra.** Basta clonar, instalar dependências e executar:

```bash
npm install
npm test
```

Não é necessário `.env`, banco de dados nem internet para a suíte Jest — tudo que toca PostgreSQL ou rede é **mockado**.

**O E2E precisa de banco.** Veja a seção [E2E](#e2e) no final deste arquivo.

**Total da suíte:** **82 testes** (79 Jest + 3 Playwright).

---

## Onde cada teste mora

### A regra do `__tests__/` colado à camada

Todo teste fica em uma pasta `__tests__/` **dentro da mesma pasta** do arquivo que ele testa. Nunca criamos uma árvore `/tests` espelhada na raiz — isso dificulta achar o teste quando você está lendo o código de produção.

```
src/modules/pets/usecases/criar-pet.usecase.ts
src/modules/pets/usecases/__tests__/criar-pet.usecase.test.ts   ✅

tests/modules/pets/usecases/criar-pet.test.ts                   ❌
```

### Árvore real deste repositório

```
src/
├── shared/__tests__/
│   └── ambiente.test.ts                    # fumaça da infra Jest
├── modules/pets/
│   ├── usecases/__tests__/                 # 3 arquivos · 11 testes
│   ├── handlers/__tests__/                 # 3 arquivos · 10 testes
│   └── repositories/__tests__/             # 1 arquivo  · 11 testes
├── app/api/pets/__tests__/
│   ├── route.test.ts                       # GET + POST · 7 testes
│   └── id-route.test.ts                    # DELETE   · 6 testes
├── actions/pets/__tests__/                 # 3 arquivos · 12 testes
├── hooks/pets/__tests__/                   # 1 arquivo  · 11 testes
└── components/features/petshop/__tests__/  # 2 arquivos · 10 testes

e2e/
└── pets.spec.ts                            # 3 cenários Playwright

playwright.config.ts                        # config E2E (raiz)
jest.config.js                              # config Jest (raiz)
jest.setup.js                               # jest-dom (raiz)
```

**Exceções à regra:**
- Testes **E2E** ficam em `e2e/` na raiz (Playwright).
- Fábricas compartilhadas ficam em `src/shared/testing/` (não são arquivos de teste — veja [padrão-ouro](#padrão-ouro-por-camada)).
- Testes de integração do **DELETE** ficam em `app/api/pets/__tests__/id-route.test.ts` — **não** dentro de `[id]/__tests__/`, para evitar que o Next varra um segmento dinâmico extra durante o build.

---

## Mapa das camadas

| Camada | Arquivo(s) de produção | O que é mockado | Por quê | Testes |
|---|---|---|---|---|
| Use case | `criar-pet`, `listar-pets`, `remover-pet` | `repositorio-pet` | Regras de negócio não devem abrir conexão real | **11** |
| Handler | `criar-pet`, `listar-pets`, `remover-pet` | use case correspondente | Testamos normalização/repasse, não o banco | **10** |
| Repositório | `repositorio-pet.ts` | `db` + `formatar-data` | Simula Drizzle sem PostgreSQL | **11** |
| Rota API | `app/api/pets/route.ts` | só `repositorio-pet` | Handler + use case rodam de verdade | **7** |
| Rota API | `app/api/pets/[id]/route.ts` | só `repositorio-pet` | Idem — integração até o repositório | **6** |
| Action | `create`, `list`, `delete` `.action.ts` | `global.fetch` | Actions só falam HTTP | **12** |
| Hook | `use-pets.ts` | as 3 actions | Hook não deve chamar rede real | **11** |
| Componente | `CardPet`, `FormAdicionarPet` | — (puro) | Testamos o que o usuário vê | **10** |
| Infraestrutura | Jest + jsdom | — | Confirma que o ambiente funciona | **1** |
| **Total Jest** | | | | **79** |
| **E2E Playwright** | `/pets` (fluxo completo) | — (app + banco reais) | Valida o caminho do clique ao PostgreSQL | **3** |
| **Total geral** | | | | **82** |

Proporção aproximada: ~70% unitário · ~20% integração · ~10% E2E.

---

## Como ler uma falha do Jest

Quando um teste quebra, leia nesta ordem:

1. **Arquivo** — qual camada falhou (`criar-pet.handler.test.ts`)?
2. **Nome do teste** — qual comportamento era esperado (`NÃO deve incluir o campo raça...`)?
3. **Expected / Received** — o que o Jest esperava vs. o que recebeu.
4. **Linha** — número no final do stack trace.

### Exemplo real: correção da raça (R17)

Este vermelho apareceu **antes** da correção no handler — prova de que o teste estava verificando algo de verdade:

```
FAIL src/modules/pets/handlers/__tests__/criar-pet.handler.test.ts
  ● criarPetHandler › NÃO deve incluir o campo raça quando ela vier só com espaços

    expect(received).not.toHaveProperty(path)

    Expected path: not "raca"

    Received value: ""

      37 |     expect(enviado).not.toHaveProperty("raca");
```

**Como interpretar:**
- O teste esperava que o objeto enviado ao use case **não tivesse** a propriedade `raca`.
- O handler incluiu `raca: ""` porque `"   "` é truthy em JavaScript.
- A correção foi trocar `dados.raca ?` por `dados.raca?.trim() ?` no handler.

---

## Como escrever um teste novo

### Passo a passo geral

1. **Abra o arquivo de produção** e leia exports, mensagens de erro e labels — nunca invente.
2. **Crie** `__tests__/<nome-exato>.test.ts` na mesma pasta.
3. **Escreva o comentário didático** no topo (3–5 linhas: o que testa, o que mockou, por quê).
4. **Mock com factory explícita** se a cadeia de imports alcança `db.ts` (regra R18).
5. **`jest.clearAllMocks()`** no `beforeEach`.
6. **Nome do teste:** `deve ... quando ...` em português.
7. **Estrutura AAA** com comentários `// PREPARAR`, `// AGIR`, `// VERIFICAR`.
8. Rode `npm test <nome-do-arquivo>` e confirme verde.

### Padrão-ouro por camada

**Fábrica compartilhada** — `src/shared/testing/pet-factory.ts` exporta `criarPetFake()`. Use nos testes de use case, handler, repositório, actions e hook quando precisar de um pet válido sem repetir o objeto literal em cada arquivo.

**Use case** — mock do repositório:

```ts
jest.mock("../../repositories/repositorio-pet", () => ({
  repositorioPet: { salvar: jest.fn() },
}));

test("deve recusar nome com menos de 2 letras", async () => {
  await expect(criarPetUseCase({ ...petValido, nome: "R" }))
    .rejects.toThrow("ao menos 2 letras");
  expect(salvarMock).not.toHaveBeenCalled();
});
```

**Handler** — mock do use case:

```ts
jest.mock("../../usecases/criar-pet.usecase", () => ({
  criarPetUseCase: jest.fn(),
}));
```

**Repositório** — mock do `db` + `formatar-data`.

**Componente** — `render` + `userEvent` + `getByLabelText` / `getByRole`.

**Integração de rota** — só `repositorio-pet` mockado; handler e use case reais. Use `@jest-environment node` no topo do arquivo.

**Action** — reatribua `global.fetch` no `beforeEach`.

**Hook** — componente-cobaia + mock das 3 actions com factory explícita.

---

## Erros comuns (sintoma → solução)

| Sintoma | Causa | Solução |
|---|---|---|
| `DATABASE_URL não foi configurada` ao rodar teste de handler/use case | `jest.mock("caminho")` **sem factory** — Jest carrega o módulo real até `db.ts` | Use factory: `jest.mock("...", () => ({ fn: jest.fn() }))` (R18) |
| Teste passa sozinho, falha na suíte | Mock não limpo entre testes | `jest.clearAllMocks()` no `beforeEach` |
| `await user.click(...)` sem `await` | Interação assíncrona incompleta | Sempre `await` em `user.*` e em `expect(...).rejects` |
| `onSubmit` nunca dispara no formulário | Campos `required` vazios bloqueiam submit no jsdom | Preencha nome (≥2) e dono (≥3) antes de clicar em enviar |
| `expect(obj).toBe(outro)` falha com objetos iguais | `toBe` compara referência, não conteúdo | Use `toEqual` para objetos e arrays |
| Teste de rota DELETE quebra silenciosamente | `params` é `Promise<{ id: string }>` no Next 15+ | `await DELETE(req, { params: Promise.resolve({ id: "1" }) })` |
| `Property fetch does not exist` | jsdom não tem `fetch` nativo | `global.fetch = jest.fn()` no `beforeEach` das actions |
| `restoreAllMocks` não “desfaz” o fetch | Atribuição direta `global.fetch = jest.fn()` não é spy | O isolamento vem do **Jest por arquivo** + **reatribuição no beforeEach** — não conte só com `restoreAllMocks` |
| `ReferenceError: Request is not defined` | Teste de rota rodando em jsdom | Adicione `@jest-environment node` no comentário do topo do arquivo |
| E2E falha com `password authentication failed` no log **mesmo com `.env` correto** | `reuseExistingServer: true` reutilizou um `npm run dev` antigo, iniciado **antes** de corrigir o `.env` — o processo em memória ainda usa credenciais velhas | Pare o servidor de desenvolvimento (`Ctrl+C` no terminal do `dev`) e rode `npm run test:e2e` de novo, **ou** suba um `npm run dev` novo antes do E2E. Em CI (`CI=true`), o Playwright sempre sobe servidor fresco |

---

## Decisões registradas

| Regra | O que significa neste projeto |
|---|---|
| **R17** | Bug real: `raca: "   "` era incluída como `{ raca: "" }` no handler. Corrigido com `dados.raca?.trim() ?`. Teste de regressão preservado. |
| **R19** | Repositório **mapeia**, não higieniza. Se o banco tiver `raca: "  "`, o DTO reflete isso. Limpeza é trabalho do handler. |
| **400, não 404** | Pet inexistente na rota DELETE responde **400** com `{ mensagem: "Pet não encontrado." }` — decisão do código, não engano do teste. |
| **DELETE fora de `[id]/__tests__/`** | Testes em `app/api/pets/__tests__/id-route.test.ts` importam `../[id]/route` sem criar pasta de teste dentro do segmento dinâmico. |
| **`@jest-environment node`** | Testes de rota API precisam de `Request`/`NextRequest`, indisponíveis no jsdom. |
| **`workers: 1` fixo** | Playwright não usa `process.env.CI ? 1 : undefined` — um worker sempre, porque os cenários compartilham o mesmo banco. |

---

## Cobertura

Saída de `npm run test:cov` (estado atual):

```
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |     100 |      100 |     100 |     100 |                   
 actions/pets                |     100 |      100 |     100 |     100 |                   
  create-pet.action.ts       |     100 |      100 |     100 |     100 |                   
  delete-pet.action.ts       |     100 |      100 |     100 |     100 |                   
  list-pets.action.ts        |     100 |      100 |     100 |     100 |                   
 app/api/pets                |     100 |      100 |     100 |     100 |                   
  route.ts                   |     100 |      100 |     100 |     100 |                   
 app/api/pets/[id]           |     100 |      100 |     100 |     100 |                   
  route.ts                   |     100 |      100 |     100 |     100 |                   
 components/features/petshop |     100 |      100 |     100 |     100 |                   
  CardPet.tsx                |     100 |      100 |     100 |     100 |                   
  FormAdicionarPet.tsx       |     100 |      100 |     100 |     100 |                   
 hooks/pets                  |     100 |      100 |     100 |     100 |                   
  use-pets.ts                |     100 |      100 |     100 |     100 |                   
 infrastructure/schemas      |     100 |      100 |     100 |     100 |                   
  schema-pets.ts             |     100 |      100 |     100 |     100 |                   
 modules/pets/handlers       |     100 |      100 |     100 |     100 |                   
  criar-pet.handler.ts       |     100 |      100 |     100 |     100 |                   
  listar-pets.handler.ts     |     100 |      100 |     100 |     100 |                   
  remover-pet.handler.ts     |     100 |      100 |     100 |     100 |                   
 modules/pets/repositories   |     100 |      100 |     100 |     100 |                   
  repositorio-pet.ts         |     100 |      100 |     100 |     100 |                   
 modules/pets/usecases       |     100 |      100 |     100 |     100 |                   
  criar-pet.usecase.ts       |     100 |      100 |     100 |     100 |                   
  listar-pets.usecase.ts     |     100 |      100 |     100 |     100 |                   
  remover-pet.usecase.ts     |     100 |      100 |     100 |     100 |                   
 shared/testing              |     100 |      100 |     100 |     100 |                   
  pet-factory.ts             |     100 |      100 |     100 |     100 |                   
-----------------------------|---------|----------|---------|---------|-------------------

Test Suites: 16 passed, 16 total
Tests:       79 passed, 79 total
```

### O que os números querem dizer

- **% Stmts / Lines** — quantas linhas de código foram executadas pelo menos uma vez.
- **% Branch** — quantos caminhos de `if/else` foram percorridos (o mais importante para validações).
- **% Funcs** — quantas funções foram chamadas.

**100% não prova que o código está correto** — prova apenas que **não há código não exercitado** pela suíte atual. Um teste pode passar com asserção fraca; por isso usamos nomes descritivos, pares “lança erro + não chamou o banco” e o exemplo vermelho-verde da raça como material de aula.

---

## E2E

Os **3 cenários** em `e2e/pets.spec.ts` rodam com Playwright contra a aplicação real e o PostgreSQL configurado no `.env`.

### Cenários

1. **Cadastrar** — preenche formulário em `/pets`, verifica card com raça entre parênteses.
2. **Validação HTML** — nome com 1 letra bloqueado pelo navegador (`:invalid`), sem requisição.
3. **Remover** — cadastra pet com nome único, clica em Remover no card certo, verifica que sumiu.

### Configuração do banco (quem acabou de clonar)

#### Opção A — Supabase (recomendado se você já usa o projeto)

1. Copie a connection string do **Transaction Pooler** (porta 6543) no painel Supabase.
2. Cole em `.env` como `DATABASE_URL=...`
3. Se a senha tiver `@`, `#` ou `%`, codifique na URL (`@` → `%40`) ou copie a string pronta do painel.
4. Crie a tabela: `npm run db:push`
5. Confirme: `npm run dev` → abra `http://localhost:3000/pets` (lista carrega sem erro no terminal).
6. Rode: `npm run test:e2e`

#### Opção B — PostgreSQL local em contêiner (sem Supabase)

```bash
docker run --name petshop-pg -e POSTGRES_PASSWORD=petshop123 -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:16
```

No `.env`:

```env
DATABASE_URL="postgresql://postgres:petshop123@localhost:5432/postgres"
```

Depois:

```bash
npm run db:push
npm run test:e2e
```

### Configuração Playwright relevante

Em `playwright.config.ts`:

```ts
fullyParallel: true,
// Cenários E2E compartilham um banco real: paralelismo gera corrida e falha intermitente.
workers: 1,
```

- `workers: 1` é **fixo** (não condicional a `CI`) — cenários compartilham banco real.
- `webServer` sobe `npm run dev` automaticamente; fora de CI, `reuseExistingServer: true` reutiliza servidor já em execução.
- Cada teste usa `nomeUnico = Rex-e2e-${Date.now()}` e limpa no `afterEach`.

**Total da suíte completa:** **82 testes** (79 Jest + 3 E2E).
