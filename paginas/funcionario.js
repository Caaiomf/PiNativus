import { produtos } from "../dados/produtos.js";
import { dinheiro, escapar } from "../utils/formatacao.js";
import { layout } from "./layout.js";

export function renderFuncionario(req) {
  return layout(req, "Funcionario", `
    <main class="container py-4" style="max-width:900px;">
      <h1 class="h3 text-success fw-bold mb-4">Area do funcionario</h1>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <i class="bi bi-plus-circle fs-1 text-success"></i>
              <h2 class="h5 mt-3">Cadastrar produto</h2>
              <p class="text-muted">Adicionar novos itens ao catalogo.</p>
              <a class="btn btn-success" href="/cadastroProduto">Abrir</a>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <i class="bi bi-table fs-1 text-success"></i>
              <h2 class="h5 mt-3">Listar produtos</h2>
              <p class="text-muted">Visualizar e apagar produtos cadastrados.</p>
              <a class="btn btn-outline-success" href="/listaProdutos">Abrir</a>
            </div>
          </div>
        </div>
      </div>
    </main>`);
}

export function renderCadastroProduto(req, erro = "") {
  return layout(req, "Cadastro Produto", `
    <main class="container py-4" style="max-width:860px;">
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-success-subtle text-success fw-bold">Cadastro de produto</div>
        <div class="card-body">
          ${erro ? `<div class="alert alert-danger">${escapar(erro)}</div>` : ""}
          <form method="POST" action="/cadastroProduto" enctype="multipart/form-data" class="row g-3">
            <div class="col-md-8">
              <label class="form-label" for="nome">Nome do produto</label>
              <input class="form-control" id="nome" name="nome" required>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="categoria">Categoria</label>
              <input class="form-control" id="categoria" name="categoria" required>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="precoProduto">Preco</label>
              <input class="form-control" id="precoProduto" name="preco" placeholder="0,00" inputmode="numeric" required>
              <div class="form-text">Digite 1230 para virar 12,30.</div>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="unidade">Unidade</label>
              <select class="form-select" id="unidade" name="unidade">
                <option>kg</option>
                <option>unidade</option>
                <option>pacote</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label" for="imagem">Imagem existente</label>
              <input class="form-control" id="imagem" name="imagem" placeholder="Design_sem_nome.png">
            </div>
            <div class="col-12">
              <label class="form-label" for="imagemArquivo">Enviar imagem do produto</label>
              <input class="form-control" id="imagemArquivo" name="imagemArquivo" type="file" accept="image/*">
              <div class="form-text">Se enviar uma imagem, ela sera usada no lugar do nome digitado acima.</div>
            </div>
            <div class="col-12 d-flex justify-content-end gap-2">
              <a class="btn btn-outline-secondary" href="/funcionario">Voltar</a>
              <button class="btn btn-success" type="submit">Cadastrar</button>
            </div>
          </form>
        </div>
      </div>
      <script>
        const campoPreco = document.getElementById("precoProduto");
        campoPreco.addEventListener("input", () => {
          const digitos = campoPreco.value.replace(/\\D/g, "");
          if (!digitos) {
            campoPreco.value = "";
            return;
          }
          const numero = (Number(digitos) / 100).toFixed(2).replace(".", ",");
          campoPreco.value = numero.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".");
        });
      </script>
    </main>`);
}

export function renderListaProdutos(req) {
  const linhas = produtos.map((produto) => `
    <tr>
      <td class="text-center">
        <input class="form-check-input produto-check" type="checkbox" name="ids" value="${escapar(produto.id)}" aria-label="Selecionar ${escapar(produto.nome)}">
      </td>
      <td>${escapar(produto.nome)}</td>
      <td>${escapar(produto.categoria)}</td>
      <td>${dinheiro(produto.preco)}</td>
      <td>${escapar(produto.unidade)}</td>
      <td>${escapar(produto.imagem)}</td>
    </tr>`).join("");

  return layout(req, "Lista Produtos", `
    <main class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h3 text-success fw-bold mb-0">Produtos cadastrados</h1>
        <a class="btn btn-success" href="/cadastroProduto">Novo produto</a>
      </div>
      <div id="mensagemSelecao" class="alert alert-warning py-2 d-none">Selecione pelo menos um produto para excluir.</div>
      <form method="POST" action="/produtos/removerSelecionados" id="formExcluirProdutos">
        <div class="table-responsive shadow-sm rounded">
          <table class="table table-striped table-hover align-middle bg-white">
            <thead class="table-success">
              <tr>
                <th class="text-center" style="width:52px;">
                  <input class="form-check-input" type="checkbox" id="selecionarTodos" aria-label="Selecionar todos os produtos">
                </th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preco</th>
                <th>Unidade</th>
                <th>Imagem</th>
              </tr>
            </thead>
            <tbody>${linhas || `<tr><td colspan="6" class="text-center text-muted py-4">Nenhum produto cadastrado.</td></tr>`}</tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-outline-danger" id="btnExcluirSelecionados" type="submit" disabled>
            <i class="bi bi-trash"></i> Excluir selecionados
          </button>
        </div>
      </form>
      <script>
        const formExcluirProdutos = document.getElementById("formExcluirProdutos");
        const selecionarTodos = document.getElementById("selecionarTodos");
        const checksProdutos = Array.from(document.querySelectorAll(".produto-check"));
        const btnExcluirSelecionados = document.getElementById("btnExcluirSelecionados");
        const mensagemSelecao = document.getElementById("mensagemSelecao");

        function quantidadeSelecionada() {
          return checksProdutos.filter((check) => check.checked).length;
        }

        function atualizarEstadoSelecao() {
          const qtd = quantidadeSelecionada();
          btnExcluirSelecionados.disabled = qtd === 0;
          btnExcluirSelecionados.innerHTML = qtd
            ? '<i class="bi bi-trash"></i> Excluir ' + qtd + ' selecionado(s)'
            : '<i class="bi bi-trash"></i> Excluir selecionados';
          if (selecionarTodos) {
            selecionarTodos.checked = checksProdutos.length > 0 && qtd === checksProdutos.length;
            selecionarTodos.indeterminate = qtd > 0 && qtd < checksProdutos.length;
          }
          if (qtd > 0) mensagemSelecao.classList.add("d-none");
        }

        selecionarTodos?.addEventListener("change", () => {
          checksProdutos.forEach((check) => { check.checked = selecionarTodos.checked; });
          atualizarEstadoSelecao();
        });

        checksProdutos.forEach((check) => check.addEventListener("change", atualizarEstadoSelecao));

        formExcluirProdutos.addEventListener("submit", (evento) => {
          if (!quantidadeSelecionada()) {
            evento.preventDefault();
            mensagemSelecao.classList.remove("d-none");
          }
        });
      </script>
    </main>`);
}
