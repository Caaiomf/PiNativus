import { alerta, layout } from "./layout.js";
import { escapar, hojeISO } from "../utils/formatacao.js";

function campoClass(erros, nome) {
  return erros[nome] ? "form-control is-invalid" : "form-control";
}

function erroCampo(erros, nome) {
  return erros[nome] ? `<div class="invalid-feedback">${escapar(erros[nome])}</div>` : "";
}

export function renderCadastro(req, dados = {}, erros = {}) {
  const valor = (nome) => escapar(dados[nome] || "");
  const nascimentoMaximo = hojeISO();

  return layout(req, "Cadastro", `
    <main class="container py-4" style="max-width:920px;">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-success-subtle text-success fw-bold">
          <i class="bi bi-person-plus me-2"></i>Cadastro de usuario
        </div>
        <div class="card-body p-4">
          ${Object.keys(erros).length ? alerta("danger", "Corrija os campos destacados antes de continuar.") : ""}
          <form method="POST" action="/cadastro" class="row g-3" id="formCadastro" novalidate>
            <div class="col-md-8">
              <label class="form-label" for="nome">Nome completo</label>
              <input class="${campoClass(erros, "nome")}" id="nome" name="nome" value="${valor("nome")}" required>
              ${erroCampo(erros, "nome")}
            </div>
            <div class="col-md-4">
              <label class="form-label" for="nascimento">Nascimento</label>
              <input class="${campoClass(erros, "nascimento")}" id="nascimento" name="nascimento" type="date" max="${nascimentoMaximo}" value="${valor("nascimento")}" required>
              ${erroCampo(erros, "nascimento")}
            </div>
            <div class="col-md-6">
              <label class="form-label" for="email">E-mail</label>
              <input class="${campoClass(erros, "email")}" id="email" name="email" type="email" value="${valor("email")}" required>
              ${erroCampo(erros, "email")}
            </div>
            <div class="col-md-6">
              <label class="form-label" for="telefone">Telefone</label>
              <input class="${campoClass(erros, "telefone")}" id="telefone" name="telefone" value="${valor("telefone")}" placeholder="(00) 00000-0000" inputmode="numeric" maxlength="15" required>
              ${erroCampo(erros, "telefone")}
            </div>
            <div class="col-md-6">
              <label class="form-label" for="cpf">CPF</label>
              <input class="${campoClass(erros, "cpf")}" id="cpf" name="cpf" value="${valor("cpf")}" placeholder="000.000.000-00" inputmode="numeric" maxlength="14" required>
              ${erroCampo(erros, "cpf")}
            </div>
            <div class="col-md-6">
              <label class="form-label" for="cep">CEP</label>
              <input class="${campoClass(erros, "cep")}" id="cep" name="cep" value="${valor("cep")}" placeholder="00000-000" inputmode="numeric" maxlength="9" required>
              ${erroCampo(erros, "cep")}
            </div>
            <div class="col-md-8">
              <label class="form-label" for="endereco">Endereco</label>
              <input class="${campoClass(erros, "endereco")}" id="endereco" name="endereco" value="${valor("endereco")}" required>
              ${erroCampo(erros, "endereco")}
            </div>
            <div class="col-md-4">
              <label class="form-label" for="numero">Numero</label>
              <input class="${campoClass(erros, "numero")}" id="numero" name="numero" value="${valor("numero")}" inputmode="numeric" maxlength="8" required>
              ${erroCampo(erros, "numero")}
            </div>
            <div class="col-md-5"><label class="form-label" for="bairro">Bairro</label><input class="form-control" id="bairro" name="bairro" value="${valor("bairro")}" readonly></div>
            <div class="col-md-5"><label class="form-label" for="cidade">Cidade</label><input class="form-control" id="cidade" name="cidade" value="${valor("cidade")}" readonly></div>
            <div class="col-md-2"><label class="form-label" for="uf">UF</label><input class="form-control" id="uf" name="uf" value="${valor("uf")}" readonly></div>
            <div class="col-md-6">
              <label class="form-label" for="senha">Senha</label>
              <input class="${campoClass(erros, "senha")}" id="senha" name="senha" type="password" minlength="6" required>
              ${erroCampo(erros, "senha")}
            </div>
            <div class="col-md-6">
              <label class="form-label" for="confirmarSenha">Confirmar senha</label>
              <input class="${campoClass(erros, "confirmarSenha")}" id="confirmarSenha" name="confirmarSenha" type="password" minlength="6" required>
              ${erroCampo(erros, "confirmarSenha")}
            </div>
            <div class="col-12 d-flex justify-content-end gap-2">
              <a class="btn btn-outline-secondary" href="/login">Voltar</a>
              <button class="btn btn-success" type="submit">Criar conta</button>
            </div>
          </form>
        </div>
      </div>
    </main>
    <script>
      const apenasNumeros = (valor) => valor.replace(/\\D/g, "");
      const alertaCadastro = document.createElement("div");
      alertaCadastro.className = "alert alert-warning py-2 d-none";
      document.getElementById("formCadastro").prepend(alertaCadastro);

      function mostrarAlertaCadastro(texto) { alertaCadastro.textContent = texto; alertaCadastro.classList.remove("d-none"); }
      function ocultarAlertaCadastro() { alertaCadastro.classList.add("d-none"); }
      function mascaraTelefone(campo) {
        let v = apenasNumeros(campo.value).slice(0, 11);
        if (v.length > 10) v = v.replace(/(\\d{2})(\\d{5})(\\d{0,4})/, "($1) $2-$3");
        else v = v.replace(/(\\d{2})(\\d{4})(\\d{0,4})/, "($1) $2-$3");
        campo.value = v.replace(/[-\\s]$/, "");
      }
      function mascaraCPF(campo) {
        let v = apenasNumeros(campo.value).slice(0, 11);
        v = v.replace(/(\\d{3})(\\d)/, "$1.$2")
             .replace(/(\\d{3})\\.(\\d{3})(\\d)/, "$1.$2.$3")
             .replace(/(\\d{3})\\.(\\d{3})\\.(\\d{3})(\\d{1,2})$/, "$1.$2.$3-$4");
        campo.value = v;
      }
      function validarCPFCliente(valor) {
        const cpf = apenasNumeros(valor);
        if (cpf.length !== 11 || /^(\\d)\\1{10}$/.test(cpf)) return false;
        let soma = 0;
        for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
        let digito = (soma * 10) % 11;
        if (digito === 10) digito = 0;
        if (digito !== Number(cpf[9])) return false;
        soma = 0;
        for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
        digito = (soma * 10) % 11;
        if (digito === 10) digito = 0;
        return digito === Number(cpf[10]);
      }
      function mascaraCEP(campo) {
        const v = apenasNumeros(campo.value).slice(0, 8);
        campo.value = v.length > 5 ? v.slice(0, 5) + "-" + v.slice(5) : v;
      }
      document.getElementById("telefone").addEventListener("input", (e) => mascaraTelefone(e.target));
      document.getElementById("cpf").addEventListener("input", (e) => {
        mascaraCPF(e.target);
        if (apenasNumeros(e.target.value).length === 11) {
          if (!validarCPFCliente(e.target.value)) {
            e.target.classList.add("is-invalid");
            mostrarAlertaCadastro("Este CPF vai dar erro: informe um CPF valido.");
          } else {
            e.target.classList.remove("is-invalid");
            ocultarAlertaCadastro();
          }
        }
      });
      document.getElementById("cep").addEventListener("input", async (e) => {
        mascaraCEP(e.target);
        const cep = apenasNumeros(e.target.value);
        if (cep.length !== 8) return;
        try {
          const resposta = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
          const dados = await resposta.json();
          if (dados.erro) {
            e.target.classList.add("is-invalid");
            mostrarAlertaCadastro("CEP nao encontrado.");
            return;
          }
          e.target.classList.remove("is-invalid");
          document.getElementById("endereco").value = dados.logradouro || "";
          document.getElementById("bairro").value = dados.bairro || "";
          document.getElementById("cidade").value = dados.localidade || "";
          document.getElementById("uf").value = dados.uf || "";
          document.getElementById("numero").focus();
          ocultarAlertaCadastro();
        } catch { mostrarAlertaCadastro("Nao foi possivel buscar o CEP agora."); }
      });
      document.getElementById("numero").addEventListener("input", (e) => { e.target.value = apenasNumeros(e.target.value).slice(0, 8); });
      document.getElementById("nascimento").addEventListener("change", (e) => {
        const hoje = "${nascimentoMaximo}";
        if (e.target.value && e.target.value > hoje) {
          e.target.classList.add("is-invalid");
          mostrarAlertaCadastro("Esta data de nascimento vai dar erro: ela nao pode ser maior que hoje.");
        } else {
          e.target.classList.remove("is-invalid");
          ocultarAlertaCadastro();
        }
      });
    </script>`);
}
