/**
 * Teste de fumaça da Fase 1 — confirma que Jest, jsdom e jest-dom estão
 * configurados corretamente. Se este arquivo falhar, a infraestrutura
 * ainda não está pronta para receber os testes das fases seguintes.
 */
test("deve expor matchers do jest-dom no ambiente jsdom", () => {
  // PREPARAR
  document.body.innerHTML = "<p>PetShop X4</p>";

  // VERIFICAR
  expect(document.querySelector("p")).toHaveTextContent("PetShop X4");
});
