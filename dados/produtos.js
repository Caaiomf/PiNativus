export let produtos = [
  ["tomate-organico", "Tomate Organico", 6, "kg", "legumes-Tomate-Andrea-1586283695804.png", "Legumes"],
  ["alface-crespa", "Alface Crespa Organica", 3.5, "unidade", "images.jpg", "Verduras"],
  ["banana-prata", "Banana Prata Organica", 5, "kg", "banana_prata.jpg", "Frutas"],
  ["cenoura-organica", "Cenoura Organica", 4.2, "kg", "cenoura.jpg", "Legumes"],
  ["mamao-papaia", "Mamao Papaia Organico", 5.5, "unidade", "mamaopapaia.jpg", "Frutas"],
  ["laranja-lima", "Laranja Lima Organica", 4.5, "unidade", "laranja.jpg", "Frutas"],
  ["espinafre-organico", "Espinafre Organico", 4, "kg", "espinafre.jpg", "Verduras"],
  ["pimentao-organico", "Pimentao Organico", 13, "kg", "pimenta-o-vermelho-10kg-1gks5c1n3c.webp", "Legumes"],
  ["brocolis-organico", "Brocolis Organico", 14, "kg", "brocolis.jpg", "Verduras"]
].map(([id, nome, preco, unidade, imagem, categoria]) => ({ id, nome, preco, unidade, imagem, categoria }));

export const entregas = {
  expressa: { nome: "Entrega Expressa", detalhe: "Receba hoje em ate 2h", valor: 8.9 },
  padrao: { nome: "Entrega Padrao", detalhe: "Receba em 1 a 2 dias uteis", valor: 4.9 },
  retirada: { nome: "Retirar na loja", detalhe: "Disponivel em 30 minutos", valor: 0 }
};

export const pagamentos = {
  pix: { nome: "PIX", detalhe: "5% de desconto automatico" },
  cartao: { nome: "Cartao de credito", detalhe: "Em ate 3x sem juros" },
  boleto: { nome: "Boleto bancario", detalhe: "Vence em 3 dias uteis" },
  dinheiro: { nome: "Dinheiro na entrega", detalhe: "Pagamento ao entregador" }
};

export const cupons = {
  NATIVUS10: 0.1,
  VERDE5: 0.05,
  BEMVINDO: 0.15
};

export function adicionarProduto(produto) {
  produtos.push(produto);
}

export function removerProduto(id) {
  produtos = produtos.filter((produto) => produto.id !== id);
}
