import { alerta, layout } from "./layout.js";
import { escapar, hojeISO } from "../utils/formatacao.js";

function campoClass(erros, nome) {
  return erros[nome] ? "form-control is-invalid" : "form-control";
}

function selectClass(erros, nome) {
  return erros[nome] ? "form-select is-invalid" : "form-select";
}

function checkClass(erros, nome) {
  return erros[nome] ? "form-check-input is-invalid" : "form-check-input";
}

function erroCampo(erros, nome) {
  return `<div class="invalid-feedback">${escapar(erros[nome] || "")}</div>`;
}

export function renderCadastro(req, dados = {}, erros = {}) {
  const valor = (nome) => escapar(dados[nome] || "");
  const selecionado = (nome, esperado) => String(dados[nome] || "") === esperado ? "selected" : "";
  const marcado = (nome) => ["sim", "on", true].includes(dados[nome]) ? "checked" : "";
  const tipoPessoaAtual = dados.tipoPessoa === "juridica" ? "juridica" : "fisica";
  const nascimentoMaximo = hojeISO();

  return layout(req, "Cadastro", `
    <main class="container py-4" style="max-width:980px;">
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
            <div class="col-md-4">
              <label class="form-label" for="tipoPessoa">Tipo de pessoa</label>
              <select class="${selectClass(erros, "tipoPessoa")}" id="tipoPessoa" name="tipoPessoa" required>
                <option value="fisica" ${tipoPessoaAtual === "fisica" ? "selected" : ""}>Pessoa fisica</option>
                <option value="juridica" ${selecionado("tipoPessoa", "juridica")}>Pessoa juridica</option>
              </select>
              ${erroCampo(erros, "tipoPessoa")}
            </div>
            <div class="col-md-4 ${tipoPessoaAtual === "juridica" ? "d-none" : ""}" id="grupoCpf">
              <label class="form-label" for="cpf">CPF</label>
              <input class="${campoClass(erros, "cpf")}" id="cpf" name="cpf" value="${valor("cpf")}" placeholder="000.000.000-00" inputmode="numeric" maxlength="14" ${tipoPessoaAtual === "fisica" ? "required" : ""}>
              ${erroCampo(erros, "cpf")}
            </div>
            <div class="col-md-4 ${tipoPessoaAtual === "fisica" ? "d-none" : ""}" id="grupoCnpj">
              <label class="form-label" for="cnpj">CNPJ</label>
              <input class="${campoClass(erros, "cnpj")}" id="cnpj" name="cnpj" value="${valor("cnpj")}" placeholder="00.000.000/0000-00" inputmode="numeric" maxlength="18" ${tipoPessoaAtual === "juridica" ? "required" : ""}>
              <div class="form-text">Obrigatorio para pessoa juridica.</div>
              ${erroCampo(erros, "cnpj")}
            </div>
            <div class="col-md-4">
              <label class="form-label" for="cep">CEP</label>
              <input class="${campoClass(erros, "cep")}" id="cep" name="cep" value="${valor("cep")}" placeholder="00000-000" inputmode="numeric" maxlength="9" required>
              ${erroCampo(erros, "cep")}
            </div>
            <div class="col-md-6">
              <label class="form-label" for="endereco">Endereco</label>
              <input class="${campoClass(erros, "endereco")}" id="endereco" name="endereco" value="${valor("endereco")}" required>
              ${erroCampo(erros, "endereco")}
            </div>
            <div class="col-md-2">
              <label class="form-label" for="numero">Numero</label>
              <input class="${campoClass(erros, "numero")}" id="numero" name="numero" value="${valor("numero")}" inputmode="numeric" maxlength="8" required>
              ${erroCampo(erros, "numero")}
            </div>
            <div class="col-md-5">
              <label class="form-label" for="complemento">Complemento</label>
              <input class="form-control" id="complemento" name="complemento" value="${valor("complemento")}" placeholder="Apartamento, bloco, casa...">
            </div>
            <div class="col-md-7">
              <label class="form-label" for="referencia">Ponto de referencia</label>
              <input class="${campoClass(erros, "referencia")}" id="referencia" name="referencia" value="${valor("referencia")}" placeholder="Ex: proximo ao mercado central" minlength="3" required>
              ${erroCampo(erros, "referencia")}
            </div>
            <div class="col-md-5"><label class="form-label" for="bairro">Bairro</label><input class="form-control" id="bairro" name="bairro" value="${valor("bairro")}" readonly></div>
            <div class="col-md-5"><label class="form-label" for="cidade">Cidade</label><input class="form-control" id="cidade" name="cidade" value="${valor("cidade")}" readonly></div>
            <div class="col-md-2"><label class="form-label" for="uf">UF</label><input class="form-control" id="uf" name="uf" value="${valor("uf")}" readonly></div>
            <div class="col-md-4">
              <label class="form-label" for="contatoPreferido">Contato preferido</label>
              <select class="${selectClass(erros, "contatoPreferido")}" id="contatoPreferido" name="contatoPreferido" required>
                <option value="">Selecione</option>
                <option value="whatsapp" ${selecionado("contatoPreferido", "whatsapp")}>WhatsApp</option>
                <option value="email" ${selecionado("contatoPreferido", "email")}>E-mail</option>
                <option value="telefone" ${selecionado("contatoPreferido", "telefone")}>Telefone</option>
              </select>
              ${erroCampo(erros, "contatoPreferido")}
            </div>
            <div class="col-md-8">
              <label class="form-label" for="observacoes">Observacoes de entrega</label>
              <textarea class="form-control" id="observacoes" name="observacoes" rows="2" maxlength="180" placeholder="Preferencias, horarios ou cuidados na entrega">${valor("observacoes")}</textarea>
              <div class="form-text">Opcional, ate 180 caracteres.</div>
            </div>
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
            <div class="col-md-6">
              <div class="form-check">
                <input class="form-check-input" id="receberOfertas" name="receberOfertas" value="sim" type="checkbox" ${marcado("receberOfertas")}>
                <label class="form-check-label" for="receberOfertas">Quero receber ofertas e novidades</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-check">
                <input class="${checkClass(erros, "aceitarTermos")}" id="aceitarTermos" name="aceitarTermos" value="sim" type="checkbox" ${marcado("aceitarTermos")} required>
                <label class="form-check-label" for="aceitarTermos">Aceito os termos de cadastro</label>
                ${erroCampo(erros, "aceitarTermos")}
              </div>
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
      const formCadastro = document.getElementById("formCadastro");
      const apenasNumeros = (valor) => valor.replace(/\\D/g, "");
      const alertaCadastro = document.createElement("div");
      alertaCadastro.className = "alert alert-warning py-2 d-none";
      formCadastro.prepend(alertaCadastro);

      function mostrarAlertaCadastro(texto) { alertaCadastro.textContent = texto; alertaCadastro.classList.remove("d-none"); }
      function ocultarAlertaCadastro() { alertaCadastro.classList.add("d-none"); }
      function feedbackDoCampo(campo) {
        return campo.parentElement.querySelector(".invalid-feedback");
      }
      function definirErro(campo, mensagem) {
        const feedback = feedbackDoCampo(campo);
        if (mensagem) {
          campo.classList.add("is-invalid");
          if (feedback) feedback.textContent = mensagem;
          return false;
        }
        campo.classList.remove("is-invalid");
        if (feedback) feedback.textContent = "";
        return true;
      }
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
      function mascaraCNPJ(campo) {
        let v = apenasNumeros(campo.value).slice(0, 14);
        v = v.replace(/(\\d{2})(\\d)/, "$1.$2")
             .replace(/(\\d{2})\\.(\\d{3})(\\d)/, "$1.$2.$3")
             .replace(/(\\d{2})\\.(\\d{3})\\.(\\d{3})(\\d)/, "$1.$2.$3/$4")
             .replace(/(\\d{2})\\.(\\d{3})\\.(\\d{3})\\/(\\d{4})(\\d{1,2})$/, "$1.$2.$3/$4-$5");
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
      function validarCNPJCliente(valor) {
        const cnpj = apenasNumeros(valor);
        if (cnpj.length !== 14 || /^(\\d)\\1{13}$/.test(cnpj)) return false;
        const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const calcular = (tamanho, pesos) => {
          let soma = 0;
          for (let i = 0; i < tamanho; i++) soma += Number(cnpj[i]) * pesos[i];
          const resto = soma % 11;
          return resto < 2 ? 0 : 11 - resto;
        };
        return calcular(12, pesos1) === Number(cnpj[12]) && calcular(13, pesos2) === Number(cnpj[13]);
      }
      function mascaraCEP(campo) {
        const v = apenasNumeros(campo.value).slice(0, 8);
        campo.value = v.length > 5 ? v.slice(0, 5) + "-" + v.slice(5) : v;
      }
      function validarCamposCadastro() {
        const campos = {
          nome: document.getElementById("nome"),
          email: document.getElementById("email"),
          telefone: document.getElementById("telefone"),
          tipoPessoa: document.getElementById("tipoPessoa"),
          cpf: document.getElementById("cpf"),
          cnpj: document.getElementById("cnpj"),
          nascimento: document.getElementById("nascimento"),
          cep: document.getElementById("cep"),
          endereco: document.getElementById("endereco"),
          numero: document.getElementById("numero"),
          referencia: document.getElementById("referencia"),
          contatoPreferido: document.getElementById("contatoPreferido"),
          senha: document.getElementById("senha"),
          confirmarSenha: document.getElementById("confirmarSenha"),
          aceitarTermos: document.getElementById("aceitarTermos")
        };
        let valido = true;
        valido = definirErro(campos.nome, campos.nome.value.trim().length >= 3 ? "" : "Informe o nome completo.") && valido;
        valido = definirErro(campos.email, /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(campos.email.value) ? "" : "Informe um e-mail valido.") && valido;
        valido = definirErro(campos.telefone, [10, 11].includes(apenasNumeros(campos.telefone.value).length) ? "" : "Informe um telefone com DDD.") && valido;
        valido = definirErro(campos.tipoPessoa, ["fisica", "juridica"].includes(campos.tipoPessoa.value) ? "" : "Selecione o tipo de pessoa.") && valido;
        if (campos.tipoPessoa.value === "fisica") {
          valido = definirErro(campos.cpf, validarCPFCliente(campos.cpf.value) ? "" : "Informe um CPF valido.") && valido;
          definirErro(campos.cnpj, "");
        } else {
          valido = definirErro(campos.cnpj, validarCNPJCliente(campos.cnpj.value) ? "" : "Informe um CNPJ valido.") && valido;
          definirErro(campos.cpf, "");
        }
        valido = definirErro(campos.nascimento, campos.nascimento.value && campos.nascimento.value <= "${nascimentoMaximo}" ? "" : "A data de nascimento nao pode ser vazia nem futura.") && valido;
        valido = definirErro(campos.cep, apenasNumeros(campos.cep.value).length === 8 ? "" : "Informe um CEP com 8 numeros.") && valido;
        valido = definirErro(campos.endereco, campos.endereco.value.trim().length >= 3 ? "" : "Informe o endereco.") && valido;
        valido = definirErro(campos.numero, apenasNumeros(campos.numero.value).length > 0 ? "" : "Informe o numero.") && valido;
        valido = definirErro(campos.referencia, campos.referencia.value.trim().length >= 3 ? "" : "Informe um ponto de referencia.") && valido;
        valido = definirErro(campos.contatoPreferido, ["whatsapp", "email", "telefone"].includes(campos.contatoPreferido.value) ? "" : "Escolha uma forma de contato.") && valido;
        valido = definirErro(campos.senha, campos.senha.value.length >= 6 ? "" : "A senha deve ter pelo menos 6 caracteres.") && valido;
        valido = definirErro(campos.confirmarSenha, campos.confirmarSenha.value === campos.senha.value ? "" : "As senhas nao coincidem.") && valido;
        valido = definirErro(campos.aceitarTermos, campos.aceitarTermos.checked ? "" : "Aceite os termos para continuar.") && valido;
        return valido;
      }

      document.getElementById("telefone").addEventListener("input", (e) => mascaraTelefone(e.target));
      document.getElementById("cnpj").addEventListener("input", (e) => {
        mascaraCNPJ(e.target);
        if (apenasNumeros(e.target.value).length === 14) definirErro(e.target, validarCNPJCliente(e.target.value) ? "" : "Informe um CNPJ valido.");
      });
      function atualizarDocumentoVisivel() {
        const tipoPessoa = document.getElementById("tipoPessoa");
        const grupoCpf = document.getElementById("grupoCpf");
        const grupoCnpj = document.getElementById("grupoCnpj");
        const cpf = document.getElementById("cpf");
        const cnpj = document.getElementById("cnpj");

        if (tipoPessoa.value === "juridica") {
          grupoCpf.classList.add("d-none");
          grupoCnpj.classList.remove("d-none");
          cpf.required = false;
          cnpj.required = true;
          cpf.value = "";
          definirErro(cpf, "");
          if (!apenasNumeros(cnpj.value)) definirErro(cnpj, "Informe o CNPJ para pessoa juridica.");
        } else {
          grupoCnpj.classList.add("d-none");
          grupoCpf.classList.remove("d-none");
          cnpj.required = false;
          cpf.required = true;
          cnpj.value = "";
          definirErro(cnpj, "");
          if (!apenasNumeros(cpf.value)) definirErro(cpf, "");
        }
      }
      document.getElementById("tipoPessoa").addEventListener("change", atualizarDocumentoVisivel);
      atualizarDocumentoVisivel();
      document.getElementById("cpf").addEventListener("input", (e) => {
        mascaraCPF(e.target);
        if (apenasNumeros(e.target.value).length === 11) {
          if (!validarCPFCliente(e.target.value)) {
            definirErro(e.target, "Informe um CPF valido.");
            mostrarAlertaCadastro("Este CPF vai dar erro: informe um CPF valido.");
          } else {
            definirErro(e.target, "");
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
            definirErro(e.target, "CEP nao encontrado.");
            mostrarAlertaCadastro("CEP nao encontrado.");
            return;
          }
          definirErro(e.target, "");
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
        if (e.target.value && e.target.value > "${nascimentoMaximo}") {
          definirErro(e.target, "A data de nascimento nao pode ser maior que hoje.");
          mostrarAlertaCadastro("Data de nascimento ela nao pode ser maior que hoje.");
        } else {
          definirErro(e.target, "");
          ocultarAlertaCadastro();
        }
      });
      formCadastro.addEventListener("submit", (e) => {
        ocultarAlertaCadastro();
        if (!validarCamposCadastro()) {
          e.preventDefault();
          mostrarAlertaCadastro("Corrija os campos destacados antes de continuar.");
          formCadastro.querySelector(".is-invalid")?.focus();
        }
      });
    </script>`);
}
