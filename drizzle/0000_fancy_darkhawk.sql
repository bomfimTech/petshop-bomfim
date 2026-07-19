CREATE TABLE "pets" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"especie" text NOT NULL,
	"dono" text NOT NULL,
	"raca" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
