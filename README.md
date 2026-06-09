# PetShop · Arquitetura X4

Projeto modelo de referência para o ebook **PetShop · Arquitetura X4 com Next.js** (Paulo Odilon).

## Tecnologias

- **Next.js 16** (App Router)
- **TypeScript**
- **React 19**
- **Drizzle ORM** + **SQLite** (better-sqlite3)
- **Tailwind CSS**

## Arquitetura X4

```
src/
├── app/                    # Rotas Next.js (páginas + API)
├── components/             # Peças visuais puras (só props)
├── hooks/                  # Gerente de estado da tela
├── actions/                # Ações da interface (fetch → API)
├── modules/pets/           # Domínio de negócio
│   ├── dto/                # Contratos (Omit/Pick)
│   ├── handlers/           # Entrada do domínio
│   ├── usecases/           # Regras de negócio
│   └── repositories/       # Acesso ao banco
├── infrastructure/         # Drizzle + SQLite
└── shared/                 # Tipos e mocks (não importa nada)
```

## Como rodar

```bash
# Instalar dependências
npm install

# Criar tabelas no banco (rodar uma vez)
npm run db:generate
npm run db:migrate

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) e clique em **Ver Pets Cadastrados**.

## Fluxo ponta a ponta

```
Component → Hook → Action → fetch("/api/pets")
                              ↓
                         route.ts → Handler → Use Case → Repository → SQLite
```

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:generate` | Gera migrations a partir do schema |
| `npm run db:migrate` | Executa migrations no SQLite |
| `npm run db:studio` | Abre o Drizzle Studio |
