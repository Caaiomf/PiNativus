import { dinheiro, escapar } from "../utils/formatacao.js";
import { itensCarrinho } from "../sessao.js";
import { layout } from "./layout.js";

export function renderCarrinho(req) {
  const itens = itensCarrinho(req);
  const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const linhas = itens.map((item) => `
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body d-flex gap-3 align-items-center">
        <img src="/imagens/${escapar(item.imagem)}" alt="${escapar(item.nome)}" class="rounded" style="width:84px;height:84px;object-fit:cover;">
        <div class="flex-grow-1">
          <h2 class="h6 text-success fw-bold mb-1">${escapar(item.nome)}</h2>
          <p class="small text-muted mb-2">${dinheiro(item.preco)} / ${escapar(item.unidade)}</p>
          <div class="d-flex align-items-center gap-2">
            <span class="small text-muted">Qtd.</span>
            <form method="POST" action="/carrinho/alterar" class="m-0">
              <input type="hidden" name="id" value="${escapar(item.id)}">
              <input type="hidden" name="delta" value="-1">
              <button class="btn btn-outline-success btn-sm rounded-circle d-inline-flex align-items-center justify-content-center" style="width:32px;height:32px;" type="submit" aria-label="Diminuir quantidade">
                <i class="bi bi-dash"></i>
              </button>
            </form>
            <strong class="text-dark px-1">${item.quantidade}</strong>
            <form method="POST" action="/carrinho/alterar" class="m-0">
              <input type="hidden" name="id" value="${escapar(item.id)}">
              <input type="hidden" name="delta" value="1">
              <button class="btn btn-outline-success btn-sm rounded-circle d-inline-flex align-items-center justify-content-center" style="width:32px;height:32px;" type="submit" aria-label="Aumentar quantidade">
                <i class="bi bi-plus"></i>
              </button>
            </form>
          </div>
        </div>
        <div class="text-end">
          <p class="fw-bold mb-2">${dinheiro(item.preco * item.quantidade)}</p>
          <form method="POST" action="/carrinho/remover">
            <input type="hidden" name="id" value="${escapar(item.id)}">
            <button class="btn btn-danger btn-sm" type="submit" aria-label="Remover produto"><i class="bi bi-trash"></i></button>
          </form>
        </div>
      </div>
    </div>`).join("");

  return layout(req, "Carrinho", `
    <main class="container py-4" style="max-width:960px;">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 text-success fw-bold mb-0">Carrinho</h1>
        <form method="POST" action="/carrinho/limpar">
          <button class="btn btn-outline-danger btn-sm" type="submit">Esvaziar</button>
        </form>
      </div>
      ${itens.length ? linhas : `<div class="alert alert-light border text-center py-5">Seu carrinho esta vazio.<br><a class="btn btn-success mt-3" href="/index.html">Ver produtos</a></div>`}
      <div class="card border-0 shadow-sm">
        <div class="card-body d-flex flex-column flex-md-row justify-content-between gap-2 align-items-md-center">
          <strong class="fs-4">Total: ${dinheiro(subtotal)}</strong>
          <div class="d-flex gap-2">
            <a class="btn btn-outline-success" href="/index.html">Continuar comprando</a>
            <a class="btn btn-warning" href="/finalizar">Finalizar compra</a>
          </div>
        </div>
      </div>
    </main>`);
}
