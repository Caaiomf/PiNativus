import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { adicionarProduto, entregas, pagamentos, produtos, removerProduto } from "./dados/produtos.js";
import { carregarUsuarios, salvarUsuarios } from "./dados/usuarios.js";
import { calcularTotais, carrinhoDaSessao, verificarFuncionario, verificarUsuarioLogado } from "./sessao.js";
import { criarId, parsePrecoCentavos, somenteDigitos } from "./utils/formatacao.js";
import { validarCadastro } from "./utils/validacoes.js";
import { layout } from "./paginas/layout.js";
import { renderCadastro } from "./paginas/cadastro.js";
import { renderCarrinho } from "./paginas/carrinho.js";
import { renderCadastroProduto, renderFuncionario, renderListaProdutos } from "./paginas/funcionario.js";
import { renderFinalizar, renderPedidoConfirmado } from "./paginas/finalizar.js";
import { renderIndex } from "./paginas/loja.js";
import { renderLogin } from "./paginas/login.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const host = "0.0.0.0";
const porta = process.env.PORT || 3000;
const server = express();
const pastaUploads = path.join(__dirname, "public", "imagens", "uploads");

fs.mkdirSync(pastaUploads, { recursive: true });

const uploadProduto = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, pastaUploads);
    },
    filename(req, file, cb) {
      const extensao = path.extname(file.originalname).toLowerCase();
      const nomeBase = String(req.body.nome || "produto")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "produto";
      cb(null, `${Date.now()}-${nomeBase}${extensao}`);
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Envie somente arquivos de imagem."));
  }
});

function receberImagemProduto(req, res, next) {
  uploadProduto.single("imagemArquivo")(req, res, (erro) => {
    if (erro) {
      res.status(400).send(renderCadastroProduto(req, erro.message || "Nao foi possivel enviar a imagem."));
      return;
    }
    next();
  });
}

server.use(session({
  secret: process.env.SESSION_SECRET || "NativusSessaoSimples",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60, sameSite: "lax" }
}));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

const imageStaticOptions = {
  etag: false,
  cacheControl: false,
  setHeaders(res) {
    res.setHeader("Cache-Control", "no-store");
  }
};

server.use("/imagens", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
server.use("/imagens", express.static(path.join(__dirname, "public", "imagens"), imageStaticOptions));

server.use((req, res, next) => {
  req.ultimoAcesso = req.cookies?.ultimoAcesso;
  res.cookie("ultimoAcesso", new Date().toLocaleString("pt-BR"), { sameSite: "lax" });
  next();
});

server.get(["/", "/index", "/index.html"], (req, res) => {
  res.send(renderIndex(req));
});

server.get(["/cliente", "/cliente.html"], (req, res) => {
  res.redirect("/index.html");
});

server.get("/login", (req, res) => {
  res.send(renderLogin(req));
});

server.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const senha = String(req.body.senha || "");
  const tipo = req.body.tipo === "funcionario" ? "funcionario" : "cliente";
  const usuarios = await carregarUsuarios();
  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario || usuario.senha !== senha) {
    res.send(renderLogin(req, "E-mail ou senha invalido."));
    return;
  }

  if (usuario.tipo !== tipo) {
    res.send(renderLogin(req, "Esta conta nao tem permissao para este tipo de acesso."));
    return;
  }

  req.session.dadosLogin = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    logado: true
  };
  res.redirect(usuario.tipo === "funcionario" ? "/funcionario" : "/index.html");
});

server.get("/cadastro", (req, res) => {
  res.send(renderCadastro(req));
});

server.post("/cadastro", async (req, res) => {
  const dados = {
    nome: String(req.body.nome || "").trim(),
    email: String(req.body.email || "").trim().toLowerCase(),
    nascimento: String(req.body.nascimento || "").trim(),
    telefone: String(req.body.telefone || "").trim(),
    tipoPessoa: req.body.tipoPessoa === "juridica" ? "juridica" : "fisica",
    cpf: String(req.body.cpf || "").trim(),
    cnpj: String(req.body.cnpj || "").trim(),
    cep: String(req.body.cep || "").trim(),
    endereco: String(req.body.endereco || "").trim(),
    numero: String(req.body.numero || "").trim(),
    complemento: String(req.body.complemento || "").trim(),
    bairro: String(req.body.bairro || "").trim(),
    cidade: String(req.body.cidade || "").trim(),
    uf: String(req.body.uf || "").trim(),
    referencia: String(req.body.referencia || "").trim(),
    contatoPreferido: String(req.body.contatoPreferido || "").trim(),
    observacoes: String(req.body.observacoes || "").trim(),
    receberOfertas: req.body.receberOfertas === "sim" ? "sim" : "nao",
    aceitarTermos: req.body.aceitarTermos === "sim" ? "sim" : "nao",
    senha: String(req.body.senha || ""),
    confirmarSenha: String(req.body.confirmarSenha || "")
  };
  const usuarios = await carregarUsuarios();
  const erros = validarCadastro(dados, usuarios);

  if (Object.keys(erros).length) {
    res.send(renderCadastro(req, dados, erros));
    return;
  }

  const usuario = {
    id: crypto.randomUUID(),
    nome: dados.nome,
    email: dados.email,
    nascimento: dados.nascimento,
    telefone: somenteDigitos(dados.telefone),
    tipoPessoa: dados.tipoPessoa,
    cpf: somenteDigitos(dados.cpf),
    cnpj: String(dados.cnpj || "").toUpperCase().replace(/[^A-Z0-9]/g, ""),
    cep: somenteDigitos(dados.cep),
    endereco: dados.endereco,
    numero: dados.numero,
    complemento: dados.complemento,
    bairro: dados.bairro,
    cidade: dados.cidade,
    uf: dados.uf,
    referencia: dados.referencia,
    contatoPreferido: dados.contatoPreferido,
    observacoes: dados.observacoes,
    receberOfertas: dados.receberOfertas,
    aceitarTermos: dados.aceitarTermos,
    senha: dados.senha,
    tipo: "cliente"
  };

  usuarios.push(usuario);
  await salvarUsuarios(usuarios);
  req.session.dadosLogin = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    logado: true
  };
  res.redirect("/index.html");
});

server.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

server.post("/carrinho/adicionar", (req, res) => {
  const produto = produtos.find((p) => p.id === req.body.id);
  if (!produto) return res.redirect("/index.html");

  const carrinho = carrinhoDaSessao(req);
  const item = carrinho.find((i) => i.id === produto.id);
  if (item) item.quantidade += 1;
  else carrinho.push({ id: produto.id, quantidade: 1 });

  res.redirect(req.body.acao === "comprar" ? "/carrinho" : "/index.html");
});

server.get("/carrinho", (req, res) => {
  res.send(renderCarrinho(req));
});

server.post("/carrinho/alterar", (req, res) => {
  const item = carrinhoDaSessao(req).find((i) => i.id === req.body.id);
  if (item) item.quantidade = Math.max(1, item.quantidade + Number(req.body.delta || 0));
  res.redirect("/carrinho");
});

server.post("/carrinho/remover", (req, res) => {
  req.session.carrinho = carrinhoDaSessao(req).filter((item) => item.id !== req.body.id);
  res.redirect("/carrinho");
});

server.post("/carrinho/limpar", (req, res) => {
  req.session.carrinho = [];
  res.redirect("/carrinho");
});

server.get("/finalizar", verificarUsuarioLogado, (req, res) => {
  res.send(renderFinalizar(req));
});

server.post("/finalizar/atualizar", verificarUsuarioLogado, (req, res) => {
  req.session.checkout = {
    entrega: entregas[req.body.entrega] ? req.body.entrega : "expressa",
    pagamento: pagamentos[req.body.pagamento] ? req.body.pagamento : "pix",
    cupom: req.body.removerCupom ? "" : String(req.body.cupom || "").trim().toUpperCase()
  };
  res.redirect("/finalizar");
});

server.post("/finalizar/confirmar", verificarUsuarioLogado, (req, res) => {
  const totais = calcularTotais(req);
  const numeroPedido = "NTV-" + Math.floor(10000 + Math.random() * 90000);
  req.session.carrinho = [];
  req.session.checkout = { entrega: "expressa", pagamento: "pix", cupom: "" };
  res.send(renderPedidoConfirmado(req, totais, numeroPedido));
});

server.get("/funcionario", verificarFuncionario, (req, res) => {
  res.send(renderFuncionario(req));
});

server.get("/cadastroProduto", verificarFuncionario, (req, res) => {
  res.send(renderCadastroProduto(req));
});

server.post("/cadastroProduto", verificarFuncionario, receberImagemProduto, (req, res) => {
  const nome = String(req.body.nome || "").trim();
  const categoria = String(req.body.categoria || "").trim();
  const unidade = String(req.body.unidade || "unidade").trim();
  const imagemDigitada = String(req.body.imagem || "").trim();
  const imagem = req.file ? `uploads/${req.file.filename}` : imagemDigitada || "Design_sem_nome.png";
  const preco = parsePrecoCentavos(req.body.preco);

  if (!nome || !categoria || !preco) {
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch {
      }
    }
    res.send(renderCadastroProduto(req, "Preencha nome, categoria e preco."));
    return;
  }

  adicionarProduto({ id: criarId(nome), nome, preco, unidade, imagem, categoria });
  res.redirect("/listaProdutos");
});

server.post("/produto/remover", verificarFuncionario, (req, res) => {
  removerProduto(String(req.body.id || ""));
  res.redirect("/listaProdutos");
});

server.post("/produtos/removerSelecionados", verificarFuncionario, (req, res) => {
  const idsRecebidos = Array.isArray(req.body.ids)
    ? req.body.ids
    : req.body.ids
      ? [req.body.ids]
      : [];

  idsRecebidos.map(String).forEach((id) => removerProduto(id));
  res.redirect("/listaProdutos");
});

server.get("/listaProdutos", verificarFuncionario, (req, res) => {
  res.send(renderListaProdutos(req));
});

await carregarUsuarios();
server.listen(porta, host, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
