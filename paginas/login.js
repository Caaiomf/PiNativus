import { alerta, layout } from "./layout.js";

export function renderLogin(req, erro = "") {
  let aviso = "";
  if (req.query.aviso === "login") aviso = "Faca login para continuar.";
  if (req.query.aviso === "funcionario") aviso = "Acesso permitido apenas para funcionario.";

  return layout(req, "Login", `
    <main class="container py-5" style="max-width:480px;">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="text-center mb-4">
            <img src="/imagens/logo-nativus-login.png" alt="Nativus" class="img-fluid" style="max-width:240px;height:auto;">
            <h1 class="h3 text-success fw-bold mt-2">Entrar</h1>
          </div>
          ${alerta("warning", aviso)}
          ${alerta("danger", erro)}
          <form method="POST" action="/login" class="d-flex flex-column gap-3">
            <div>
              <label class="form-label" for="tipo">Tipo de acesso</label>
              <select class="form-select" id="tipo" name="tipo">
                <option value="cliente">Usuario</option>
                <option value="funcionario">Funcionario</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="email">E-mail</label>
              <input class="form-control" id="email" name="email" type="email" required>
            </div>
            <div>
              <label class="form-label" for="senha">Senha</label>
              <input class="form-control" id="senha" name="senha" type="password" required>
            </div>
            <button class="btn btn-success" type="submit">Entrar</button>
          </form>
          <p class="text-center mt-3 mb-0">Nao tem conta? <a href="/cadastro">Cadastre-se</a></p>
          <div class="alert alert-light border mt-3 small mb-0">
            Funcionario inicial: <strong>funcionario@nativus.com.br</strong><br>
            Senha: <strong>Nativus@123</strong>
          </div>
        </div>
      </div>
    </main>`);
}
