export function formatarDataCriacao(valor: string): string {
  if (!valor?.trim()) return "—";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    const apenasData = valor.split("T")[0];
    const partes = apenasData.split("-");

    if (partes.length === 3 && partes.every((p) => /^\d+$/.test(p))) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return valor;
  }

  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
