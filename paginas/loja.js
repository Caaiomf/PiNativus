import { produtos } from "../dados/produtos.js";
import { dinheiro, escapar } from "../utils/formatacao.js";
import { layout } from "./layout.js";

export function renderIndex(req) {
  const busca = String(req.query.busca || "").trim().toLowerCase();
  const lista = produtos.filter((produto) => produto.nome.toLowerCase().includes(busca));
  const cards = lista.map((produto) => `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="card h-100 border-0 shadow-sm">
        <img src="/imagens/${escapar(produto.imagem)}" alt="${escapar(produto.nome)}" class="card-img-top bg-white" style="height:190px;object-fit:contain;padding:1rem;">
        <div class="card-body d-flex flex-column text-center">
          <span class="badge text-bg-success-subtle text-success align-self-center mb-2">Organico</span>
          <h2 class="h6 card-title">${escapar(produto.nome)}</h2>
          <p class="text-success fw-bold mb-3">${dinheiro(produto.preco)} / ${escapar(produto.unidade)}</p>
          <form method="POST" action="/carrinho/adicionar" class="d-flex gap-2 mt-auto">
            <input type="hidden" name="id" value="${escapar(produto.id)}">
            <button class="btn btn-warning btn-sm flex-fill" name="acao" value="comprar" type="submit">Comprar</button>
            <button class="btn btn-success btn-sm flex-fill" name="acao" value="adicionar" type="submit" aria-label="Adicionar ao carrinho">
              <i class="bi bi-cart-plus"></i>
            </button>
          </form>
        </div>
      </div>
    </div>`).join("");

  return layout(req, "Index", `
    <header class="bg-dark position-relative">
      <img src="/imagens/baner1.jpg" alt="Produtos Nativus" class="w-100 opacity-75" style="max-height:310px;object-fit:cover;">
      <div class="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3">
        <h1 class="display-5 fw-bold">Nativus</h1>
        <p class="lead">Produtos organicos frescos para sua casa.</p>
      </div>
    </header>
    <main class="container py-4">
      <form method="GET" action="/index.html" class="row g-2 mb-4">
        <div class="col-md-10">
          <input class="form-control" name="busca" value="${escapar(req.query.busca || "")}" placeholder="Buscar produtos">
        </div>
        <div class="col-md-2">
          <button class="btn btn-success w-100" type="submit">Buscar</button>
        </div>
      </form>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h3 text-success fw-bold mb-0">Produtos disponiveis</h2>
        <span class="badge text-bg-light border">${lista.length} itens</span>
      </div>
      <div class="row g-3">
        ${cards || `<div class="col-12"><div class="alert alert-light border text-center">Nenhum produto encontrado.</div></div>`}
      </div>
    </main>`);
}
