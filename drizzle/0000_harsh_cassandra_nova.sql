CREATE TABLE `pets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`especie` text NOT NULL,
	`dono` text NOT NULL,
	`raca` text,
	`criado_em` text NOT NULL
);
