export function escapar(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

export function dinheiro(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

export function somenteDigitos(valor = "") {
  return String(valor).replace(/\D/g, "");
}

export function parsePrecoCentavos(valor) {
  const digitos = somenteDigitos(valor);
  if (!digitos) return 0;
  return Number(digitos) / 100;
}

export function criarId(texto) {
  return texto.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now();
}

export function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}
