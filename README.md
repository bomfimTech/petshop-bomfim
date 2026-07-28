<div align="center">

# 🐾 PetShop · Arquitetura X4

### Next.js · Drizzle ORM · Supabase PostgreSQL · Vercel

<!-- Badges de projeto -->
<p>
  <img alt="Status" src="https://img.shields.io/badge/Status-Modelo_Did%C3%A1tico-2EA043?style=flat-square" />
  <img alt="Arquitetura" src="https://img.shields.io/badge/Arquitetura-X4_Desacoplada-E9711C?style=flat-square" />
  <img alt="Banco" src="https://img.shields.io/badge/Banco-Supabase_PostgreSQL-3FCF8E?style=flat-square" />
  <img alt="Deploy" src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square" />
  <img alt="Licença" src="https://img.shields.io/badge/Licen%C3%A7a-Uso_Did%C3%A1tico-red?style=flat-square" />
</p>

<!-- Badges de tecnologia -->
<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2.7-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Drizzle ORM" src="https://img.shields.io/badge/Drizzle_ORM-0.45-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-postgres--js-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img alt="dotenv" src="https://img.shields.io/badge/dotenv-17.4-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

</div>

---

Projeto **modelo de referência** para o ebook **PetShop · Arquitetura X4 com Next.js** (Paulo Odilon).

Este repositório é, ao mesmo tempo, um projeto funcional e um **material didático**. Ele mostra, na prática, como migrar um projeto Next.js de um banco de dados local (**SQLite**) para um banco de dados na nuvem (**PostgreSQL no Supabase**), **sem quebrar a arquitetura** do sistema.

O tutorial abaixo ensina três coisas ao mesmo tempo:

1. Como trocar **SQLite** por **PostgreSQL no Supabase**.
2. Como publicar a aplicação Next.js na **Vercel**.
3. Como a **Arquitetura X4** permite trocar a infraestrutura de banco de dados sem obrigar as telas, os hooks, as ações e as regras de negócio a mudarem junto.

> Se você está começando agora com Next.js, TypeScript, bancos de dados, ORMs e deploy, siga o guia na ordem. Cada passo explica os termos técnicos na primeira vez que eles aparecem.

---

## 1. O que você vai aprender

Ao final deste tutorial, você deve entender:

- a diferença entre **onde a aplicação roda** e **onde os dados moram**;
- o que é um **banco local** e o que é um **banco remoto**;
- o que são **variáveis de ambiente** e por que elas são secretas;
- o que é um **ORM** e o que é um **driver de banco de dados**;
- o que são **schema** e **migrations**;
- como versionar o código no **GitHub**;
- como publicar (fazer **deploy**) na **Vercel**;
- como usar o **Supabase PostgreSQL**;
- como **substituir a infraestrutura de banco** sem derrubar o domínio;
- o princípio central da **Arquitetura X4**: o desacoplamento total.

---

## 2. As três hospedagens diferentes

Um erro comum de quem está começando é achar que o código, a aplicação e o banco de dados moram no mesmo lugar. Neste projeto, cada coisa fica em um serviço diferente:

```text
Repositório de código   → GitHub
Hospedagem da aplicação → Vercel
Hospedagem do banco     → Supabase
Mapeamento do banco     → Drizzle ORM (dentro do código)
```

A aplicação e o banco **não precisam** estar hospedados no mesmo lugar. A arquitetura de aprendizado é assim:

```text
GitHub
   │
   │ código-fonte
   ▼
Vercel
   │
   │ conexão segura com PostgreSQL (lado servidor)
   ▼
Supabase PostgreSQL
```

- O **GitHub** guarda o código.
- A **Vercel** baixa o código do GitHub e executa a aplicação.
- A aplicação na Vercel abre uma conexão **do lado do servidor** com o **Supabase**.
- O **Drizzle ORM** é a biblioteca, dentro do código, que traduz seu TypeScript em comandos SQL para o PostgreSQL.

---

## 3. Tecnologias usadas (estado atual do projeto)

Estas são as tecnologias **realmente instaladas** neste repositório (veja `package.json`):

| Camada | Tecnologia | Versão declarada |
|--------|-----------|------------------|
| Framework | Next.js (App Router) | `16.2.7` |
| Biblioteca de UI | React | `19.2.4` |
| Linguagem | TypeScript | `^5` |
| ORM | Drizzle ORM | `^0.45.2` |
| Ferramenta de schema/migrations | Drizzle Kit | `^0.31.10` |
| Driver PostgreSQL | `postgres` (postgres-js) | `^3.4.9` |
| Variáveis de ambiente | dotenv | `^17.4.2` |
| Estilos | Tailwind CSS | `^4` |
| Banco de dados | Supabase PostgreSQL | — |
| Deploy | Vercel | — |

> **Importante:** este projeto **não usa mais** `SQLite` nem `better-sqlite3`. Essas dependências já foram removidas. O driver de banco atual é o pacote `postgres` (conhecido como **postgres-js**), usado junto com o adaptador `drizzle-orm/postgres-js`.

**O que é o quê:**

- **ORM (Object-Relational Mapping):** biblioteca que deixa você trabalhar com o banco usando código TypeScript em vez de escrever SQL na mão. Aqui é o **Drizzle ORM**.
- **Driver:** o pacote que realmente abre a conexão de rede com o banco e envia os comandos. Aqui é o pacote `postgres`.
- **Drizzle Kit:** ferramenta de linha de comando que gera e aplica **migrations** (as mudanças de estrutura do banco).

---

## 4. A Arquitetura X4

A ideia da Arquitetura X4 é separar o sistema em camadas, de forma que cada camada só conheça a camada imediatamente vizinha. Assim, trocar uma tecnologia (como o banco de dados) afeta o mínimo possível do resto.

Estrutura de pastas real do projeto:

```text
src/
├── app/                    # Rotas Next.js (páginas + rotas de API)
│   └── api/pets/           # Endpoints HTTP dos pets
├── components/             # Peças visuais puras (recebem só props)
├── hooks/                  # Gerenciam o estado da tela (React)
├── actions/                # Ações da interface (fazem fetch para a API)
├── modules/pets/           # Domínio de negócio dos pets
│   ├── dto/                # Contratos de dados (Omit/Pick de tipos)
│   ├── handlers/           # Entrada do domínio (normaliza dados)
│   ├── usecases/           # Regras de negócio (validações)
│   └── repositories/       # Acesso ao banco (via Drizzle)
├── infrastructure/         # Tecnologia concreta (Drizzle + PostgreSQL)
│   ├── database/           # Conexão com o banco (db.ts)
│   └── schemas/            # Schema das tabelas (schema-pets.ts)
└── shared/                 # Tipos, utilitários e mocks (não importa infraestrutura)
```

**O que cada camada faz:**

- **`app`** — as páginas e as rotas de API do Next.js. A rota de API traduz uma requisição HTTP em uma chamada de domínio.
- **`components`** — pedaços visuais reutilizáveis. Só recebem dados por **props** e mostram na tela. **Não acessam o banco.**
- **`hooks`** — controlam o estado da tela (carregando, erro, lista atual). **Não acessam o banco.**
- **`actions`** — funções da interface que chamam a API com `fetch`. São a ponte entre o front-end e o back-end.
- **`modules/pets/dto`** — os **contratos** (formatos) dos dados que entram e saem.
- **`modules/pets/handlers`** — recebem os dados, normalizam (por exemplo, `trim` e capitalização) e chamam o caso de uso.
- **`modules/pets/usecases`** — contêm as **regras de negócio** (validações como "nome precisa ter ao menos 2 letras").
- **`modules/pets/repositories`** — sabem **conversar com o banco** usando o Drizzle. É a única camada de negócio que conhece o schema.
- **`infrastructure`** — contém a **tecnologia concreta**: a conexão PostgreSQL e o schema das tabelas.
- **`shared`** — tipos de domínio, utilitários e dados de exemplo. **Não depende da infraestrutura.**

**Direção das dependências (quem chama quem):**

```text
Componentes NÃO acessam o banco.
Hooks       NÃO acessam o banco.
Actions     chamam a API (fetch).
Rotas       chamam os handlers.
Handlers    chamam os casos de uso.
Casos de uso chamam os repositórios.
Repositórios usam o adaptador de infraestrutura (Drizzle + PostgreSQL).
```

---

## 5. O fluxo, do clique ao banco

Quando o usuário cadastra um pet, os dados percorrem este caminho:

```text
Componente (FormAdicionarPet)
   ↓
Hook (usePets)
   ↓
Action (createPetAction)
   ↓
fetch("/api/pets")
   ↓
route.ts  (rota de API)
   ↓
Handler (criarPetHandler)
   ↓
Use Case (criarPetUseCase)
   ↓
Repository (repositorioPet)
   ↓
Drizzle ORM
   ↓
Supabase PostgreSQL
```

O ponto central da Arquitetura X4 é este: **só a camada de infraestrutura conhece o PostgreSQL**. As camadas de cima (componente, hook, action, domínio) continuam iguais, não importa se o banco é SQLite ou PostgreSQL.

> **Observe uma regra importante do fluxo:** **todas** as rotas de API deste projeto passam pela cadeia completa `Rota → Handler → Use Case → Repository`. Isso vale tanto para gravar (`POST /api/pets`) quanto para ler (`GET /api/pets`) e remover (`DELETE /api/pets/[id]`). Nenhuma rota "pula" camadas para falar direto com o repositório. Manter esse padrão uniforme é o que garante o desacoplamento na prática.

---

## 5.1 Por que respeitar a arquitetura (Swap Without Collapse)

Talvez a pergunta mais importante para um iniciante seja: **"por que tanta camada? não seria mais simples chamar o banco direto no componente?"**

No começo, sim — pareceria mais simples. Mas em pouco tempo o projeto viraria uma bola de neve difícil de manter. A Arquitetura X4 aplica um princípio chamado **Swap Without Collapse** (*trocar sem colapsar*):

```text
Você pode SUBSTITUIR uma peça do sistema (o banco, por exemplo)
sem que as outras peças DESABEM junto.
```

Neste repositório isso é real: a migração de **SQLite → PostgreSQL** mexeu **apenas** em 3 arquivos de infraestrutura (`db.ts`, `schema-pets.ts` e, quando a sintaxe muda, o `repositorio-pet.ts`). Componentes, hooks, actions, regras de negócio e tipos de domínio **não foram tocados**. Isso só foi possível porque a tecnologia de banco está confinada em um único lugar.

### O que a arquitetura entrega, na prática

| Benefício | Como a arquitetura garante isso |
|-----------|--------------------------------|
| 🪶 **Enxuto** | Cada arquivo tem **uma responsabilidade só**. O componente desenha a tela, o use case valida a regra, o repositório fala com o banco. Fica fácil achar e mudar as coisas, sem código repetido nem "arquivos gigantes que fazem tudo". |
| 🔒 **Seguro** | A conexão com o banco vive **só no servidor**. O `db.ts` usa `import "server-only"`, então nenhuma tela consegue importar a senha do banco por acidente. As credenciais nunca chegam ao navegador. |
| 📈 **Escalável** | Como as camadas são independentes, dá para **crescer sem reescrever tudo**: trocar o banco, adicionar cache, criar novos módulos (ex.: `agendamentos`, `vendas`) reaproveitando o mesmo padrão. |
| ⚡ **Performático** | Isolar a infraestrutura permite **otimizar em um ponto só** (pool de conexões, `prepare: false`, timeouts do serverless no `db.ts`) sem espalhar essa complexidade pelo resto do código. |

### O que aconteceria se a arquitetura fosse desrespeitada

Para entender o valor das regras, imagine violá-las:

- **Componente acessando o banco direto** → o segredo do banco vazaria para o navegador (**falha de segurança grave**) e a tela quebraria a cada troca de banco (**colapso**).
- **Regra de negócio dentro do componente** → a mesma validação seria copiada em vários lugares; corrigir um bug exigiria caçar cópias espalhadas (**não é enxuto**).
- **Rota falando direto com o Drizzle** → trocar o ORM obrigaria a mexer em todas as rotas (**não é escalável**).
- **`shared` dependendo de módulos de negócio** → criaria um "nó" de dependências circulares que trava o build e confunde o crescimento do sistema.

### As regras de ouro deste projeto

```text
Componentes recebem dados por props e NÃO acessam o banco.
Hooks cuidam do estado da tela e NÃO acessam o banco.
Actions conversam com a API via fetch.
Rotas traduzem HTTP e chamam Handlers.
Handlers normalizam a entrada e chamam Use Cases.
Use Cases contêm as regras de negócio e chamam Repositories.
Repositories são a ÚNICA porta para o banco (via Drizzle).
Infrastructure guarda a tecnologia concreta (conexão + schema).
Shared é uma "folha": tipos e utilitários que NÃO dependem de ninguém acima.
```

> **Resumo para levar para a vida:** respeitar a arquitetura não é burocracia — é o que torna o sistema **enxuto** (fácil de ler), **seguro** (segredos no servidor), **escalável** (cresce sem reescrever) e **performático** (otimização concentrada). O preço de ignorá-la aparece depois, quando qualquer mudança pequena "derruba" o sistema inteiro.

---

## 6. Por que o SQLite foi substituído

O SQLite **não é um banco ruim**. Pelo contrário: é excelente para aplicativos locais, aplicativos de desktop, testes automatizados e servidores com disco persistente. O problema não é o SQLite em si, e sim o **ambiente onde a aplicação vai rodar**.

- O **SQLite** guarda todos os dados em um **arquivo local** (por exemplo, `petshop.db`).
- O `better-sqlite3` funciona muito bem quando existe um disco fixo por perto.
- A **Vercel** roda a aplicação em ambiente **serverless**: não há um arquivo de banco local garantido e persistente.
- Um deploy serverless pode ser **recriado, substituído ou executado por várias instâncias diferentes**. Cada uma teria seu próprio arquivo — ou nenhum.
- Portanto, os dados de produção precisam de um **armazenamento remoto e persistente**.
- O **Supabase** oferece um **PostgreSQL gerenciado** (você não precisa administrar o servidor do banco).

**Resumo:** foi o ambiente de deploy (serverless na Vercel) que tornou o **PostgreSQL remoto** a escolha mais adequada — não uma falha do SQLite.

O que muda no projeto:

```text
Antes:
Repository → Drizzle → better-sqlite3 → arquivo local petshop.db

Depois:
Repository → Drizzle → postgres-js → Supabase PostgreSQL
```

E o princípio X4 que torna isso possível:

```text
O domínio e os casos de uso NÃO devem depender diretamente
da tecnologia de banco de dados.
```

Por isso, a troca de banco fica concentrada principalmente em:

```text
dependências (package.json)
adaptador de banco (db.ts)
schema do Drizzle (schema-pets.ts)
configuração do Drizzle (drizzle.config.ts)
variáveis de ambiente (.env)
fluxo de migração/deploy
```

---

## 7. Antes de começar

**Pré-requisitos (instale ou crie contas):**

```text
Node.js
npm
Git
Conta no GitHub
Conta no Supabase
Conta na Vercel
```

**Nunca publique** (nem no GitHub, nem em prints, nem neste projeto) os seguintes segredos:

```text
senha do banco de dados
DATABASE_URL
MIGRATION_DATABASE_URL
POSTGRES_URL
chaves service role
arquivos .env e .env.local
```

> Neste repositório, o arquivo `.gitignore` já ignora `.env*`. Isso significa que qualquer arquivo começando com `.env` **não é enviado** ao GitHub. Confira isso antes de cada `git push`.

---

## 8. Passo 1 — Criar o projeto no Supabase

Você **não precisa** usar o SQL Editor do Supabase. Toda a criação da tabela será feita pelo terminal, usando o Drizzle. Faça apenas:

1. Crie um novo projeto no Supabase.
2. Defina a **senha do banco de dados** (guarde-a com segurança).
3. Aguarde o provisionamento (leva alguns instantes).
4. Abra o painel de conexão do projeto (**Connect** / **Connection**).
5. Localize as **connection strings** do PostgreSQL.
6. Entenda a diferença entre os dois tipos de conexão:

   - **Transaction Pooler** — otimizado para muitas conexões curtas (ideal para ambiente serverless, como a Vercel). Normalmente usa a **porta 6543**.
   - **Session Pooler** ou **conexão direta (non-pooling)** — mantém a sessão aberta, adequado para migrations e administração do schema. Normalmente usa a **porta 5432**.

Você vai terminar com duas URLs parecidas com estas (use **apenas placeholders**, nunca a URL real):

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@HOST:6543/postgres"
MIGRATION_DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@HOST:5432/postgres"
```

> **Nunca** copie para este README uma senha, host ou referência de projeto real. Sempre use os placeholders `PROJECT_REF`, `PASSWORD` e `HOST`.

**Senha com caracteres especiais:** se a sua senha tiver símbolos, eles precisam ser codificados na URL. Alguns exemplos:

```text
@ → %40
# → %23
% → %25
```

Dica: copie a connection string pronta direto do painel do Supabase, em vez de montá-la à mão. Isso evita erros de codificação.

---

## 9. Passo 2 — Trocar as dependências

Neste projeto, a troca de dependências foi assim (o SQLite sai, o driver PostgreSQL e o `dotenv` entram):

```bash
# Remove o SQLite e seus tipos
npm uninstall better-sqlite3 @types/better-sqlite3

# Instala o driver PostgreSQL e o carregador de variáveis de ambiente
npm install postgres dotenv
```

> **Por que instalar o `dotenv`?** O `drizzle.config.ts` roda fora do Next.js (é executado direto pelo Node, via Drizzle Kit). O Node **não** lê o arquivo `.env` sozinho, então usamos o `dotenv` com `import "dotenv/config";` no topo do `drizzle.config.ts` para carregar as variáveis (como `MIGRATION_DATABASE_URL`) antes de conectar ao banco. Dentro da aplicação Next.js, o `.env` já é lido automaticamente — o `dotenv` é necessário principalmente para os comandos do Drizzle Kit no terminal.

O que acontece:

```text
drizzle-orm continua sendo o ORM (não muda).
postgres passa a ser o driver do PostgreSQL.
dotenv carrega o .env para os comandos do Drizzle Kit no terminal.
better-sqlite3 é removido, porque o projeto não usa mais o arquivo SQLite local.
```

> No estado atual deste repositório, `better-sqlite3` **já não aparece** no `package.json`, enquanto `postgres` (`^3.4.9`) e `dotenv` (`^17.4.2`) **já estão instalados**. Ou seja: esta etapa já foi concluída. Ela está documentada aqui para você entender o que foi feito.

---

## 10. Passo 3 — Configurar as variáveis de ambiente

Este projeto usa um arquivo **`.env`** na raiz para o ambiente local. O `drizzle.config.ts` carrega esse arquivo com `import "dotenv/config";`.

> O `.env` está listado no `.gitignore` (`.env*`), então ele **não vai para o GitHub**. O repositório versiona um arquivo `.env.example` (via exceção `!.env.example` no `.gitignore`) para servir de modelo — copie-o para `.env` e preencha com os seus dados. Nunca coloque valores reais no `.env.example`.

Modelo seguro (**apenas placeholders**):

```env
# Conexão da aplicação (usada por src/infrastructure/database/db.ts)
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@HOST:6543/postgres"

# Conexão para migrations / administração do schema (usada pelo Drizzle Kit)
MIGRATION_DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@HOST:5432/postgres"
```

Papel de cada variável:

```text
DATABASE_URL
→ conexão da aplicação em tempo de execução
→ Transaction Pooler
→ normalmente porta 6543

MIGRATION_DATABASE_URL
→ usada pelo Drizzle Kit e pela administração do schema
→ Session Pooler ou conexão direta (non-pooling)
→ normalmente porta 5432
```

**Como o código realmente lê essas variáveis (importante):**

- `src/infrastructure/database/db.ts` lê **somente** `DATABASE_URL`.
- `drizzle.config.ts` procura, **nesta ordem**:

```text
POSTGRES_URL_NON_POOLING  →  MIGRATION_DATABASE_URL  →  DATABASE_URL
```

Ou seja, para rodar migrations localmente, basta ter uma dessas três variáveis definidas. Para a aplicação funcionar, `DATABASE_URL` precisa existir.

> Quando você conecta o Supabase à Vercel pela integração oficial, a Vercel pode criar variáveis com nomes próprios, como `POSTGRES_URL` e `POSTGRES_URL_NON_POOLING`. O `drizzle.config.ts` deste projeto já reconhece `POSTGRES_URL_NON_POOLING`. Mas a aplicação (`db.ts`) espera **`DATABASE_URL`** — veja o alerta na seção de integração Supabase–Vercel.

---

## 11. Passo 4 — O adaptador de banco (`db.ts`)

Este é o arquivo que abre a conexão com o PostgreSQL. Ele fica em `src/infrastructure/database/db.ts` e, no estado atual, tem esta forma:

```ts
// src/infrastructure/database/db.ts
const client = postgres(connectionString, {
  prepare: false,
  max: 1,
  connect_timeout: 10,
  idle_timeout: 20,
});

export const db = drizzle(client);
```

Os pontos importantes:

- **`import "server-only";`** (primeira linha do arquivo) garante que este módulo **nunca** seja importado por um componente que roda no navegador. A conexão com o banco é assunto **exclusivo do servidor**. Se algum código de cliente tentar importar `db.ts`, o build falha de propósito — é uma proteção.
- **`import { drizzle } from "drizzle-orm/postgres-js";`** e **`import postgres from "postgres";`** — este é o adaptador PostgreSQL do Drizzle usado com o driver `postgres`.
- **`prepare: false`** — desativa *prepared statements*. Isso é necessário quando se usa o **Transaction Pooler** do Supabase (porta 6543), porque o pooler não mantém a sessão que os prepared statements exigem.
- **`max: 1`** — limita o número de conexões simultâneas. Em ambiente serverless, muitas instâncias podem subir ao mesmo tempo; manter poucas conexões por instância evita estourar o limite do banco.
- **`connect_timeout: 10`** e **`idle_timeout: 20`** — controlam por quanto tempo esperar ao conectar e por quanto tempo manter uma conexão ociosa aberta (em segundos). Ajudam a aplicação a se comportar bem no ambiente serverless.

> A validação `if (!connectionString) { throw new Error("DATABASE_URL não foi configurada."); }` faz a aplicação falhar de forma clara quando a variável está ausente, em vez de dar um erro confuso mais adiante.

---

## 12. Passo 5 — Converter o schema do Drizzle

O **schema** descreve as tabelas do banco em TypeScript. Ao migrar de SQLite para PostgreSQL, o schema muda de "core SQLite" para "core PostgreSQL".

**Antes (SQLite):**

```ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const tabelaPets = sqliteTable("pets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // ...
  criadoEm: text("criado_em"), // data como texto
});
```

**Depois (PostgreSQL) — estado atual em `src/infrastructure/schemas/schema-pets.ts`:**

```ts
// src/infrastructure/schemas/schema-pets.ts
export const tabelaPets = pgTable("pets", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  especie: text("especie").notNull(),
  dono: text("dono").notNull(),
  raca: text("raca"),
  criadoEm: timestamp("criado_em", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
}).enableRLS();
```

As conversões realizadas:

```text
sqliteTable                    → pgTable
drizzle-orm/sqlite-core        → drizzle-orm/pg-core
auto increment do SQLite       → serial (sequência automática do PostgreSQL)
data em texto (text)           → timestamp with time zone
data preenchida na mão         → defaultNow() (o banco preenche sozinho)
```

**Sobre o RLS (Row Level Security):**

- `.enableRLS()` ativa o **RLS** na tabela. RLS é um recurso do PostgreSQL que controla, linha a linha, quem pode ler ou gravar dados. O método `.enableRLS()` é suportado pela versão instalada do Drizzle ORM (`^0.45.2`).
- Neste projeto de ensino, todo o acesso ao banco acontece **no servidor** (a aplicação usa a connection string com credenciais completas). Portanto, o RLS aqui serve principalmente como boa prática de segurança da tabela; não estamos criando políticas de acesso por usuário final.
- **Não** documente nem use `pgTable.withRLS(...)`: essa forma não é a suportada por esta versão. Use apenas `.enableRLS()`, como no código acima.

---

## 13. Passo 6 — Tratamento de datas

Este projeto adota, de propósito, um modelo **simplificado para iniciantes** no que diz respeito a datas.

No domínio (`src/shared/types/domain/pet.ts`), o campo é uma **string**:

```ts
// src/shared/types/domain/pet.ts
export interface Pet {
  id: number;
  nome: string;
  especie: string;
  dono: string;
  raca?: string;
  criadoEm: string;
}
```

O fluxo interno da data é este:

```text
PostgreSQL armazena um timestamp with time zone
→ o Drizzle lê esse valor como Date (objeto de data do JavaScript)
→ formatarDataCriacao converte para texto legível
→ a resposta da API/domínio expõe criadoEm como string
```

A função utilitária aceita tanto `string` quanto `Date` e sempre devolve texto:

```ts
// src/shared/utils/formatar-data.ts
export function formatarDataCriacao(
  valor: string | Date,
): string {
  const data =
    valor instanceof Date
      ? valor
      : new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "—";
  }
  // ... formata em pt-BR (America/Fortaleza)
}
```

**Por que não enviar `criadoEm` no cadastro?**

Porque o schema usa `.defaultNow()`. Isso significa que o **próprio banco** preenche a data de criação no momento em que a linha é inserida. Por isso o repositório (`repositorioPet.salvar`) insere apenas `nome`, `especie`, `dono` e `raca` — a coluna `criado_em` é preenchida automaticamente pelo PostgreSQL.

---

## 14. Passo 7 — Configurar o Drizzle Kit

O arquivo `drizzle.config.ts` diz ao Drizzle Kit onde está o schema, para onde gerar as migrations e como conectar no banco:

```ts
// drizzle.config.ts
export default defineConfig({
  schema: "./src/infrastructure/schemas/schema-pets.ts",
  out: "./drizzle",
  dialect: "postgresql",

  dbCredentials: {
    url: databaseUrl,
  },
});
```

O que cada campo significa:

```text
schema           → caminho do arquivo de schema (schema-pets.ts)
out              → pasta onde as migrations SQL são geradas (./drizzle)
dialect          → "postgresql" (era SQLite antes da migração)
dbCredentials.url → a URL de conexão, vinda de variável de ambiente
```

**Ponto de atenção para quem vem do SQLite:** era comum ver algo assim na configuração antiga:

```ts
// INVÁLIDO depois de migrar para PostgreSQL:
url: "./petshop.db"
```

Isso apontava para um **arquivo local**. Agora, a URL precisa vir de uma **variável de ambiente** com uma connection string PostgreSQL. Neste projeto, a URL é resolvida assim (no topo do `drizzle.config.ts`):

```ts
// drizzle.config.ts (topo do arquivo)
const databaseUrl =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.MIGRATION_DATABASE_URL ??
  process.env.DATABASE_URL;
```

---

## 15. Passo 8 — Criar/atualizar a tabela pelo terminal

Você **não precisa** do SQL Editor do Supabase. O Drizzle Kit cria e atualiza a tabela por você. Existem dois níveis: um mais simples e um profissional.

### 15.1 Fluxo iniciante (rápido)

Este projeto tem o script `db:push`. Ele compara seu schema com o banco e cria/atualiza a tabela direto:

```bash
npm run db:push
```

O que acontece:

```text
schema-pets.ts
→ o Drizzle compara o schema com o banco no Supabase
→ o Drizzle cria ou atualiza a tabela "pets"
```

O `db:push` é ótimo para **laboratórios de aula** e desenvolvimento rápido, porque você não precisa administrar arquivos de migration.

### 15.2 Fluxo versionado (profissional)

```bash
npm run db:generate
npm run db:migrate
```

O que cada comando faz:

```text
db:generate
→ gera arquivos de migration em SQL (na pasta ./drizzle)

db:migrate
→ aplica as migrations pendentes no PostgreSQL
```

No fluxo profissional, os arquivos de migration **devem ser versionados** (enviados ao GitHub), para que a equipe tenha um histórico de como o banco evoluiu.

> **Cuidado:** não apague o histórico de migrations de qualquer jeito. Só faça limpeza de migrations em um **banco de aula novo e descartável**, nunca em um banco com dados reais.

---

## 16. Passo 9 — Verificar pelo terminal

Depois de criar a tabela, confirme que ela realmente existe no banco apontado pela sua URL. Rode este comando (ele usa o driver `postgres` já instalado):

```bash
node -r dotenv/config -e "const postgres=require('postgres'); const url=process.env.MIGRATION_DATABASE_URL||process.env.DATABASE_URL; const sql=postgres(url,{prepare:false}); sql.unsafe(\"select to_regclass('public.pets') as tabela\").then(r=>console.log(r[0])).catch(console.error).finally(()=>sql.end());"
```

Resultado esperado (a tabela existe):

```text
{ tabela: 'pets' }
```

Se aparecer isto, a tabela **não existe** no banco apontado por essa URL:

```text
{ tabela: null }
```

> Este projeto também traz uma rota de diagnóstico em `src/app/api/diagnostico-db/route.ts` (que roda no runtime Node.js). Ao acessá-la, ela retorna o banco atual, o usuário e se a tabela `public.pets` existe — útil para conferir a conexão em produção.

Nunca exponha segredos ao mostrar esses comandos de diagnóstico. O comando acima lê a URL das variáveis de ambiente; ele não imprime a senha.

---

## 17. Passo 10 — Rodar localmente

```bash
npm install
npm run db:push
npm run dev
```

Como testar:

1. Abra a aplicação local em [http://localhost:3000](http://localhost:3000).
2. Clique em **Ver Pets Cadastrados** e cadastre um pet.
3. Atualize (F5) a página.
4. Confirme que o pet continua aparecendo (os dados foram salvos no Supabase).
5. (Opcional) Abra o **Drizzle Studio** para ver os dados:

```bash
npm run db:studio
```

---

## 18. Passo 11 — Versionar no GitHub

```bash
git status
git add .
git commit -m "feat: migrate database to Supabase PostgreSQL"
git push origin main
```

**Antes do `git push`, confira:** rode `git status` e garanta que **`.env` e `.env.local` não aparecem** na lista. Como o `.gitignore` já ignora `.env*`, eles devem ficar de fora.

- Os **arquivos de migration** (pasta `drizzle/`) **podem** e **devem** ser versionados no fluxo profissional.
- As **credenciais** (senhas, connection strings) **nunca** podem ser versionadas.

---

## 19. Passo 12 — Deploy na Vercel

1. Importe o repositório do GitHub na Vercel.
2. A Vercel deve detectar **Next.js** automaticamente.
3. Mantenha o comando de build padrão, a menos que o projeto exija outro.
4. Conecte o Supabase pela **Vercel Marketplace** (integração) **ou** configure as variáveis manualmente.
5. Faça um **novo deploy** depois de adicionar as variáveis (variáveis novas só valem em deploys novos).
6. Teste a **URL de produção**.

**Separação de ambientes na Vercel:**

```text
Máquina local
→ variáveis do arquivo .env local

Vercel Production
→ variáveis do ambiente de Produção

Vercel Preview
→ variáveis do ambiente de Preview
```

> Uma variável configurada **só para Produção** **não** fica disponível em deploys de **Preview**. Se um deploy de Preview falhar por falta de variável, verifique em qual ambiente ela foi criada.

---

## 20. Integração Supabase–Vercel

A integração oficial pode criar automaticamente variáveis com nomes como:

```text
POSTGRES_URL
POSTGRES_PRISMA_URL
POSTGRES_URL_NON_POOLING
POSTGRES_HOST
POSTGRES_DATABASE
POSTGRES_USER
```

> Nem toda integração cria exatamente essa lista. Confira sempre quais variáveis foram realmente criadas no painel da Vercel.

**Ponto crítico deste projeto:** a aplicação (`src/infrastructure/database/db.ts`) usa **`DATABASE_URL`**. Portanto:

- Se a integração criar apenas `POSTGRES_URL` (e não `DATABASE_URL`), a aplicação **não vai encontrar a variável que espera** e falhará em produção.
- Solução: garanta que exista uma variável `DATABASE_URL` na Vercel apontando para o Supabase (você pode criá-la manualmente com o mesmo valor da conexão correta).

**Risco de bancos diferentes:** cuidado com o cenário abaixo:

```text
POSTGRES_URL apontando para um banco (projeto Supabase A)
DATABASE_URL apontando para outro banco (projeto Supabase B)
```

Isso pode fazer a aplicação **funcionar localmente e falhar na Vercel** (ou vice-versa), porque os dois ambientes estariam conectados a **projetos Supabase diferentes**.

---

## 21. Solução de problemas (baseada na experiência real da migração)

| Sintoma | Causa provável | O que verificar / fazer |
|---------|----------------|-------------------------|
| **`0 tables`** ao gerar migration | O `drizzle.config.ts` não encontrou o schema PostgreSQL | Confira o caminho em `schema`, se o arquivo exporta com `pgTable` e se os imports vêm de `drizzle-orm/pg-core` |
| **`snapshot.json data is malformed`** | Metadados de migration antigos (SQLite) misturados com os de PostgreSQL | Só em **banco de aula novo e descartável**: limpe a pasta `drizzle/` e gere as migrations do zero. Nunca faça isso com dados reais |
| **`relation "public.pets" does not exist`** | A tabela não foi criada no banco que está sendo acessado | Confira o destino da conexão, rode `npm run db:push` (ou o fluxo aprovado) e valide com `to_regclass` |
| **`to_regclass` retorna `null`** | O banco conectado não contém `public.pets` | A URL usada aponta para um banco onde a tabela ainda não existe — crie a tabela nesse banco |
| **Funciona local, falha na Vercel** | Variáveis diferentes entre ambientes | Veja se `DATABASE_URL` existe na Vercel; se `POSTGRES_URL` e `DATABASE_URL` apontam para o mesmo projeto; se as variáveis estão no ambiente certo (Production/Preview); e se houve **redeploy** após criá-las |
| **HTTP 500** | O navegador só mostra o status; a causa real está no servidor | Abra os **Runtime Logs** da Vercel para ver a mensagem de erro real |
| **Requisição fica em "Awaiting data"** | Timeout de conexão ou reuso inadequado em serverless | Verifique as opções de conexão presentes no projeto: `prepare: false`, `max: 1`, `connect_timeout`, `idle_timeout` (em `db.ts`) |
| **Senha com caracteres especiais** | URL montada à mão sem codificação | Codifique os caracteres (`@`→`%40`, `#`→`%23`, `%`→`%25`) ou copie a connection string pronta do Supabase |
| **Variável existe, mas a app não enxerga** | Nome errado, ambiente errado ou falta de redeploy | Confira o **nome exato** (`DATABASE_URL`), o ambiente (Production/Preview), se houve **novo deploy** e a ordem de fallback no código |

---

## 22. Arquitetura final

```text
Navegador
   ↓
Aplicação Next.js na Vercel
   ↓
Rota de API (route.ts)
   ↓
Handler
   ↓
Use Case
   ↓
Repository
   ↓
Adaptador Drizzle (infraestrutura)
   ↓
Supabase PostgreSQL
```

O princípio X4 que este projeto demonstra:

```text
A tecnologia de banco de dados pode ser substituída
sem obrigar as camadas visual, de aplicação e de negócio
a mudarem junto.
```

---

## 23. Scripts úteis

Scripts que **realmente existem** no `package.json`:

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Sobe a aplicação já compilada |
| `npm run lint` | Roda o ESLint |
| `npm run db:generate` | Gera arquivos de migration a partir do schema |
| `npm run db:migrate` | Aplica as migrations pendentes no PostgreSQL |
| `npm run db:push` | Sincroniza o schema direto com o banco (sem gerar arquivos) |
| `npm run db:studio` | Abre o Drizzle Studio para visualizar os dados |
| `npm test` | Roda a suíte Jest (79 testes — sem banco; 82 no total com E2E) |
| `npm run test:watch` | Testes Jest em modo observação |
| `npm run test:cov` | Testes Jest com relatório de cobertura |
| `npm run test:e2e` | Testes Playwright em `/pets` (requer banco) |

**Diferença entre `push`, `generate` e `migrate`:**

- **`db:push`** — aplica o schema **direto** no banco, sem criar arquivos de migration. Rápido para aulas e protótipos.
- **`db:generate`** — cria os **arquivos SQL** de migration (o histórico versionado), mas **não** aplica no banco.
- **`db:migrate`** — **aplica** os arquivos de migration gerados no banco. É o par do `db:generate` no fluxo profissional.

---

## Testes

Este repositório inclui uma suíte completa de testes (Jest + Playwright) como material de aula da **Arquitetura X4**.

| Resumo | Valor |
|---|---|
| **Total** | **82 testes** (79 Jest + 3 Playwright) |
| Testes Jest | **79** (16 suítes) |
| Cobertura | **100%** em statements, branches, functions e lines |
| E2E | **3** cenários em `e2e/pets.spec.ts` — requer banco configurado |

```bash
npm install
npm test          # 79 testes Jest — não precisa de .env
npm run test:cov  # com relatório de cobertura
npm run test:e2e  # +3 Playwright — requer DATABASE_URL
```

Guia completo para iniciantes: **[TESTES.md](./TESTES.md)** — onde cada teste mora, como ler falhas, erros comuns e como destravar o E2E.

---

## 24. Checklist de segurança

```text
[ ] .env está sendo ignorado pelo Git
[ ] .env.local está sendo ignorado pelo Git
[ ] nenhuma senha real aparece no README
[ ] nenhuma connection string foi commitada
[ ] nenhuma chave service-role está exposta ao navegador
[ ] variáveis de banco NÃO usam o prefixo NEXT_PUBLIC_
[ ] variáveis de Produção e Preview foram configuradas de propósito
```

> Lembre-se: qualquer variável com o prefixo `NEXT_PUBLIC_` fica **visível no navegador**. Credenciais de banco **nunca** devem usar esse prefixo — elas são assunto exclusivo do servidor.
