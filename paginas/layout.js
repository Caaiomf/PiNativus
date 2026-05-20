import { carrinhoDaSessao, usuarioLogado } from "../sessao.js";
import { escapar } from "../utils/formatacao.js";

export function alerta(tipo, texto) {
  return texto ? `<div class="alert alert-${tipo} py-2">${escapar(texto)}</div>` : "";
}

export function navbar(req) {
  const usuario = usuarioLogado(req);
  const qtd = carrinhoDaSessao(req).reduce((total, item) => total + item.quantidade, 0);

  return `
    <nav class="navbar navbar-expand-lg bg-success navbar-dark sticky-top shadow-sm">
      <div class="container-fluid px-3">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2" href="/index.html">
          <img src="/imagens/logo-nativus-navbar.png" alt="Nativus" width="40" height="40"> Nativus
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="menuPrincipal">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="/index.html">Loja</a></li>
            <li class="nav-item"><a class="nav-link" href="/carrinho">Carrinho (${qtd})</a></li>
            ${usuario?.tipo === "funcionario" ? `
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Funcionario</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/funcionario">Painel</a></li>
                  <li><a class="dropdown-item" href="/cadastroProduto">Cadastrar produto</a></li>
                  <li><a class="dropdown-item" href="/listaProdutos">Listar produtos</a></li>
                </ul>
              </li>` : ""}
          </ul>
          <div class="d-flex gap-2 align-items-center">
            ${usuario ? `
              <span class="text-white small">Ola, ${escapar(usuario.nome.split(" ")[0])}</span>
              <a class="btn btn-outline-light btn-sm" href="/logout">Sair</a>` : `
              <a class="btn btn-outline-light btn-sm" href="/login">Entrar</a>
              <a class="btn btn-warning btn-sm" href="/cadastro">Cadastrar</a>`}
          </div>
        </div>
      </div>
    </nav>`;
}

export function layout(req, titulo, conteudo) {
  return `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapar(titulo)} - Nativus</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body class="bg-light">
  ${navbar(req)}
  ${conteudo}
  <footer class="container py-4 text-center text-muted small">
    Ultimo acesso: ${escapar(req.ultimoAcesso || "Primeiro acesso")}
  </footer>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}
