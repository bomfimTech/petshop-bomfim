import { criarPetFake } from "@/shared/testing/pet-factory";

describe("criarPetFake", () => {
    test("deve sobrescrever só o campo pedido e manter o resto", () => {
        // AGIR
        const pet = criarPetFake({ nome: "Bidu" });

        // VERIFICAR
        expect(pet.nome).toBe("Bidu");
        expect(pet.especie).toBe("cachorro");
        expect(pet.dono).toBe("Ana Silva");
    });

    test("deve criar objetos independentes a cada chamada", () => {
        // PREPARAR
        const primeiro = criarPetFake();
        const segundo = criarPetFake();

        // AGIR
        primeiro.nome = "Alterado";

        // VERIFICAR
        expect(segundo.nome).toBe("Rex");
    });
});