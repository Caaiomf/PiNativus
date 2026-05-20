import { cupons, entregas, pagamentos } from "../dados/produtos.js";
import { calcularTotais } from "../sessao.js";
import { dinheiro, escapar } from "../utils/formatacao.js";
import { layout } from "./layout.js";

export function renderFinalizar(req) {
  const totais = calcularTotais(req);

  if (!totais.itens.length) {
    return layout(req, "Finalizar", `
      <main class="container py-5">
        <div class="alert alert-warning">Seu carrinho esta vazio.</div>
        <a class="btn btn-success" href="/index.html">Voltar para loja</a>
      </main>`);
  }

  const itensHtml = totais.itens.map((item) => `
    <div class="d-flex align-items-center gap-2 border-bottom py-2">
      <img src="/imagens/${escapar(item.imagem)}" alt="${escapar(item.nome)}" class="rounded" style="width:56px;height:56px;object-fit:cover;">
      <div class="flex-grow-1">
        <strong>${escapar(item.nome)}</strong>
        <small class="d-block text-muted">Qtd: ${item.quantidade}</small>
      </div>
      <strong>${dinheiro(item.preco * item.quantidade)}</strong>
    </div>`).join("");

  const entregaOptions = Object.entries(entregas).map(([id, entrega]) => `
    <option value="${id}" ${totais.checkout.entrega === id ? "selected" : ""}>
      ${entrega.nome} - ${entrega.valor === 0 ? "Gratis" : dinheiro(entrega.valor)}
    </option>`).join("");

  const pagamentoOptions = Object.entries(pagamentos).map(([id, pagamento]) => `
    <option value="${id}" ${totais.checkout.pagamento === id ? "selected" : ""}>
      ${pagamento.nome} - ${pagamento.detalhe}
    </option>`).join("");

  return layout(req, "Finalizar", `
    <main class="container py-4" style="max-width:1080px;">
      <h1 class="h3 text-success fw-bold mb-4">Finalizar compra</h1>
      <div class="row g-4">
        <section class="col-lg-7">
          <div class="card border-0 shadow-sm mb-3">
            <div class="card-header bg-success-subtle text-success fw-bold">Entrega e pagamento</div>
            <div class="card-body">
              <form method="POST" action="/finalizar/atualizar" class="row g-3" id="formCheckout">
                <div class="col-md-6">
                  <label class="form-label" for="entrega">Entrega</label>
                  <select class="form-select auto-submit" id="entrega" name="entrega">${entregaOptions}</select>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="pagamento">Pagamento</label>
                  <select class="form-select auto-submit" id="pagamento" name="pagamento">${pagamentoOptions}</select>
                </div>
                <div class="col-md-8">
                  <label class="form-label" for="cupom">Cupom</label>
                  <input class="form-control text-uppercase" id="cupom" name="cupom" value="${escapar(totais.checkout.cupom || "")}" placeholder="NATIVUS10">
                </div>
                <div class="col-md-4 d-flex align-items-end gap-2">
                  <button class="btn btn-success w-100" type="submit">Aplicar</button>
                  ${totais.codigoCupom ? `<button class="btn btn-outline-danger" type="submit" name="removerCupom" value="1" title="Remover cupom"><i class="bi bi-x-lg"></i></button>` : ""}
                </div>
                <div class="col-12">
                  <small class="text-muted">Cupons de teste: NATIVUS10, VERDE5 ou BEMVINDO. PIX aplica 5% automaticamente.</small>
                </div>
              </form>
            </div>
          </div>
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-success-subtle text-success fw-bold">Itens do pedido</div>
            <div class="card-body">${itensHtml}</div>
          </div>
        </section>
        <aside class="col-lg-5">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white fw-bold">Resumo</div>
            <div class="card-body">
              <div class="d-flex justify-content-between py-1"><span>Subtotal</span><strong>${dinheiro(totais.subtotal)}</strong></div>
              <div class="d-flex justify-content-between py-1"><span>Entrega escolhida</span><strong>${escapar(totais.entrega.nome)}</strong></div>
              <div class="d-flex justify-content-between py-1"><span>Pagamento</span><strong>${escapar(totais.pagamento.nome)}</strong></div>
              <div class="d-flex justify-content-between py-1"><span>Frete</span><strong>${totais.entrega.valor === 0 ? "Gratis" : dinheiro(totais.entrega.valor)}</strong></div>
              ${totais.descontoPix > 0 ? `<div class="d-flex justify-content-between py-1 text-success"><span>Desconto PIX</span><strong>- ${dinheiro(totais.descontoPix)}</strong></div>` : ""}
              ${totais.descontoCupom > 0 ? `<div class="d-flex justify-content-between py-1 text-success"><span>Cupom ${escapar(totais.codigoCupom)}</span><strong>- ${dinheiro(totais.descontoCupom)}</strong></div>` : ""}
              ${totais.checkout.cupom && !cupons[totais.codigoCupom] ? `<div class="alert alert-danger py-2 mt-2">Cupom invalido.</div>` : ""}
              <div class="d-flex justify-content-between fs-4 fw-bold border-top mt-2 pt-2">
                <span>Total</span>
                <span class="text-success">${dinheiro(totais.total)}</span>
              </div>
              <form method="POST" action="/finalizar/confirmar" class="mt-3">
                <button class="btn btn-warning w-100 fw-bold" type="submit">Confirmar pedido</button>
              </form>
            </div>
          </div>
        </aside>
      </div>
      <script>
        document.querySelectorAll("#formCheckout .auto-submit").forEach((campo) => {
          campo.addEventListener("change", () => document.getElementById("formCheckout").submit());
        });
      </script>
    </main>`);
}

export function renderPedidoConfirmado(req, totais, numeroPedido) {
  return layout(req, "Pedido confirmado", `
    <main class="container py-5" style="max-width:720px;">
      <div class="card border-0 shadow-sm text-center">
        <div class="card-body p-5">
          <i class="bi bi-check-circle-fill display-3 text-success"></i>
          <h1 class="h3 text-success fw-bold mt-3">Pedido confirmado!</h1>
          <p class="text-muted">Numero do pedido: <strong>#${numeroPedido}</strong></p>
          <p>Total pago: <strong>${dinheiro(totais.total)}</strong></p>
          <a class="btn btn-success" href="/index.html">Continuar comprando</a>
        </div>
      </div>
    </main>`);
}
