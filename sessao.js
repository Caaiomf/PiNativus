import { cupons, entregas, pagamentos, produtos } from "./dados/produtos.js";

export function usuarioLogado(req) {
  return req.session.dadosLogin;
}

export function verificarUsuarioLogado(req, res, next) {
  if (req.session.dadosLogin?.logado) next();
  else res.redirect("/login?aviso=login");
}

export function verificarFuncionario(req, res, next) {
  if (req.session.dadosLogin?.logado && req.session.dadosLogin.tipo === "funcionario") next();
  else res.redirect("/login?aviso=funcionario");
}

export function carrinhoDaSessao(req) {
  if (!req.session.carrinho) req.session.carrinho = [];
  return req.session.carrinho;
}

export function itensCarrinho(req) {
  return carrinhoDaSessao(req)
    .map((item) => {
      const produto = produtos.find((p) => p.id === item.id);
      return produto ? { ...produto, quantidade: item.quantidade } : null;
    })
    .filter(Boolean);
}

export function checkoutDaSessao(req) {
  if (!req.session.checkout) {
    req.session.checkout = { entrega: "expressa", pagamento: "pix", cupom: "" };
  }
  return req.session.checkout;
}

export function calcularTotais(req) {
  const checkout = checkoutDaSessao(req);
  const entrega = entregas[checkout.entrega] || entregas.expressa;
  const itens = itensCarrinho(req);
  const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const descontoPix = checkout.pagamento === "pix" ? subtotal * 0.05 : 0;
  const codigoCupom = String(checkout.cupom || "").toUpperCase();
  const descontoCupom = cupons[codigoCupom] ? subtotal * cupons[codigoCupom] : 0;
  const total = Math.max(0, subtotal + entrega.valor - descontoPix - descontoCupom);

  return {
    itens,
    checkout,
    entrega,
    pagamento: pagamentos[checkout.pagamento] || pagamentos.pix,
    subtotal,
    descontoPix,
    descontoCupom,
    total,
    codigoCupom
  };
}
