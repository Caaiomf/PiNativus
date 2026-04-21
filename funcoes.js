// ========================================================
//  NATIVUS — funcoes.js
//  Arquivo unificado: todas as funções do projeto
// ========================================================


// ════════════════════════════════════════════════════════
//  UTILITÁRIOS GERAIS
// ════════════════════════════════════════════════════════

function mostrarToast(msg, tipo) {
  let t = document.getElementById('nativus-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'nativus-toast';
    t.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
      'padding:12px 24px;border-radius:8px;font-size:15px;font-family:Arial,sans-serif;' +
      'z-index:9999;box-shadow:0 4px 14px rgba(0,0,0,0.2);transition:opacity 0.4s;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.style.background = tipo === 'erro' ? '#e53935' : '#3a8b5f';
  t.style.color = '#fff';
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._to);
  t._to = setTimeout(() => { t.style.opacity = '0'; }, 2800);
}


// ════════════════════════════════════════════════════════
//  VALIDAÇÕES
// ════════════════════════════════════════════════════════

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += +cpf[i] * (10 - i);
  let r = (s * 10) % 11; if (r >= 10) r = 0;
  if (r !== +cpf[9]) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += +cpf[i] * (11 - i);
  r = (s * 10) % 11; if (r >= 10) r = 0;
  return r === +cpf[10];
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[\.\-\/\s]/g, '').toUpperCase();
  if (cnpj.length !== 14) return false;
  if (/^(.)\1{13}$/.test(cnpj)) return false;
  function val(c) { return /\d/.test(c) ? +c : c.charCodeAt(0) - 55; }
  function calcDigito(base, pesos) {
    const soma = base.split('').reduce((a, c, i) => a + val(c) * pesos[i], 0);
    const r = soma % 11; return r < 2 ? 0 : 11 - r;
  }
  return calcDigito(cnpj.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2]) === +cnpj[12] &&
         calcDigito(cnpj.slice(0, 13), [6,5,4,3,2,9,8,7,6,5,4,3,2]) === +cnpj[13];
}


// ════════════════════════════════════════════════════════
//  MÁSCARAS DE INPUT
// ════════════════════════════════════════════════════════

function formatarDocumento(input) {
  const tipo = document.querySelector('input[name="tipo-doc"]:checked');
  let v = input.value.replace(/[^0-9A-Za-z]/g, '').toUpperCase().slice(0, 14);
  if (tipo && tipo.value === 'cpf') {
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
         .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
  } else {
    v = v.replace(/^(.{2})(.+)/, '$1.$2')
         .replace(/^(.{2}\.)(.{3})(.+)/, '$1$2.$3')
         .replace(/^(.{2}\..{3}\.)(.{3})(.+)/, '$1$2/$3')
         .replace(/^(.{2}\..{3}\..{3}\/)(.{4})(.{1,2})$/, '$1$2-$3');
  }
  input.value = v;
}

function formatarTelefone(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  else                v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  input.value = v.replace(/-$/, '');
}

function formatarPreco(input) {
  let v = input.value.replace(/\D/g, '');
  if (!v) { input.value = ''; return; }
  v = (parseInt(v, 10) / 100).toFixed(2);
  input.value = 'R$ ' + v.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function formatarCEP(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  input.value = v;
  if (v.replace(/\D/g, '').length === 8) buscarCEP(v);
}

async function buscarCEP(cep) {
  cep = cep.replace(/\D/g, '');
  if (cep.length !== 8) return;
  const campos = {
    logradouro: document.getElementById('logradouro'),
    bairro:     document.getElementById('bairro'),
    cidade:     document.getElementById('cidade'),
    uf:         document.getElementById('uf'),
  };
  if (campos.logradouro) campos.logradouro.placeholder = 'Buscando...';
  try {
    const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) { mostrarToast('CEP não encontrado.', 'erro'); return; }
    if (campos.logradouro) { campos.logradouro.value = data.logradouro || ''; campos.logradouro.placeholder = 'Rua / Avenida'; }
    if (campos.bairro)     campos.bairro.value  = data.bairro     || '';
    if (campos.cidade)     campos.cidade.value  = data.localidade || '';
    if (campos.uf)         campos.uf.value      = data.uf         || '';
    const numEl = document.getElementById('numero');
    if (numEl) numEl.focus();
    mostrarToast('Endereço preenchido automaticamente!');
  } catch { mostrarToast('Erro ao buscar CEP. Verifique sua conexão.', 'erro'); }
}


// ════════════════════════════════════════════════════════
//  CARRINHO — localStorage
// ════════════════════════════════════════════════════════

function getCarrinho() {
  return JSON.parse(localStorage.getItem('nativus_carrinho') || '[]');
}

function salvarCarrinho(itens) {
  localStorage.setItem('nativus_carrinho', JSON.stringify(itens));
}

function adicionarAoCarrinho(nome, preco, img, redirecionar) {
  const carrinho = getCarrinho();
  const idx = carrinho.findIndex(i => i.nome === nome);
  if (idx >= 0) carrinho[idx].qty = (carrinho[idx].qty || 1) + 1;
  else          carrinho.push({ nome, preco, img, qty: 1 });
  salvarCarrinho(carrinho);
  atualizarBadgeCarrinho();
  if (redirecionar) window.location.href = 'carrinho.html';
  else mostrarToast('"' + nome + '" adicionado ao carrinho!');
}

function removerDoCarrinho(index) {
  const carrinho = getCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  atualizarBadgeCarrinho();
  if (typeof renderizarCarrinhoCom === 'function') renderizarCarrinhoCom();
}

function alterarQty(index, delta) {
  const carrinho = getCarrinho();
  if (!carrinho[index]) return;
  carrinho[index].qty = Math.max(1, (carrinho[index].qty || 1) + delta);
  salvarCarrinho(carrinho);
  atualizarBadgeCarrinho();
  if (typeof renderizarCarrinhoCom === 'function') renderizarCarrinhoCom();
}

function limparCarrinho() {
  if (confirm('Deseja esvaziar o carrinho?')) {
    salvarCarrinho([]);
    atualizarBadgeCarrinho();
    if (typeof renderizarCarrinhoCom === 'function') renderizarCarrinhoCom();
  }
}

function atualizarBadgeCarrinho() {
  const badge = document.getElementById('badge-carrinho');
  if (!badge) return;
  const qtd = getCarrinho().reduce((a, i) => a + (i.qty || 1), 0);
  badge.textContent = qtd;
  badge.style.display = qtd > 0 ? 'inline-flex' : 'none';
}


// ════════════════════════════════════════════════════════
//  PÁGINA: cliente.html
// ════════════════════════════════════════════════════════

function toggleFavorito(el) {
  el.classList.toggle('ativo');
}

function filtrarProdutos(termo) {
  termo = (termo || '').toLowerCase();
  let visiveis = 0;
  document.querySelectorAll('.produto-item').forEach(card => {
    const nome = card.getAttribute('data-nome').toLowerCase();
    const v = nome.includes(termo);
    card.style.display = v ? '' : 'none';
    if (v) visiveis++;
  });
  const sr = document.getElementById('sem-resultado');
  if (sr) sr.classList.toggle('d-none', visiveis !== 0);
}


// ════════════════════════════════════════════════════════
//  PÁGINA: carrinho.html
// ════════════════════════════════════════════════════════

function renderizarCarrinhoCom() {
  const lista   = document.getElementById('lista-carrinho');
  const totalEl = document.getElementById('total-carrinho');
  if (!lista) return;
  const carrinho = getCarrinho();
  lista.innerHTML = '';
  if (carrinho.length === 0) {
    lista.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="fa-solid fa-cart-shopping fa-3x mb-3 opacity-25"></i>
        <p class="fs-5">Seu carrinho está vazio.</p>
        <a href="cliente.html" class="btn mt-2"
           style="background:#3a8b5f;color:#fff;">Ver produtos</a>
      </div>`;
    if (totalEl) totalEl.textContent = 'Total: R$ 0,00';
    return;
  }
  let total = 0;
  carrinho.forEach((item, i) => {
    const qty = item.qty || 1;
    const sub = item.preco * qty;
    total += sub;
    lista.insertAdjacentHTML('beforeend', `
      <div class="item-card p-3 d-flex justify-content-between align-items-center gap-3">
        <div class="d-flex align-items-center gap-3 flex-grow-1">
          <img src="imagens/${item.img}" alt="${item.nome}"
               onerror="this.src='imagens/Design_sem_nome.png'">
          <div>
            <p class="item-nome">${item.nome}</p>
            <p class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')} / unidade</p>
            <div class="d-flex align-items-center gap-2 mt-1">
              <button class="qty-btn" onclick="alterarQty(${i}, -1)">−</button>
              <span class="qty-num">${qty}</span>
              <button class="qty-btn" onclick="alterarQty(${i}, +1)">+</button>
            </div>
            <p class="item-sub">Subtotal: R$ ${sub.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removerDoCarrinho(${i})" title="Remover">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`);
  });
  if (totalEl) totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}


// ════════════════════════════════════════════════════════
//  PÁGINA: cadastrarproduto.html
// ════════════════════════════════════════════════════════

function formatarCodigo(input) {
  let v = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8);
  if (v.length > 4) v = v.slice(0, 4) + '-' + v.slice(4);
  input.value = v;
}

function formatarPrecoInput(input) {
  let raw = input.value.replace(/\D/g, '');
  if (!raw) {
    input.value = '';
    const prev = document.getElementById('preco-preview');
    if (prev) prev.textContent = '';
    return;
  }
  const num = parseInt(raw, 10) / 100;
  const fmt = num.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  input.value = fmt;
  const prev    = document.getElementById('preco-preview');
  const unidade = document.getElementById('unidadeProduto');
  if (prev) prev.textContent = 'R$ ' + fmt + ' / ' + (unidade ? unidade.value || 'unidade' : 'unidade');
}


// ════════════════════════════════════════════════════════
//  PÁGINA: formulario.html
// ════════════════════════════════════════════════════════

let secaoAtual = 1;

function avancar(de) {
  if (de === 1 && !validarSecao1()) return;
  if (de === 2 && !validarSecao2()) return;
  if (de === 3 && !validarSecao3()) return;
  irParaSecao(de + 1);
}

function voltar(de) {
  irParaSecao(de - 1);
}

function irParaSecao(n) {
  document.querySelector('#secao-' + secaoAtual).classList.remove('ativa');
  document.querySelector('#step-'  + secaoAtual).classList.remove('ativo');
  secaoAtual = n;
  document.querySelector('#secao-' + n).classList.add('ativa');
  document.querySelector('#step-'  + n).classList.add('ativo');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function marcar(id, errId, invalido, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  if (!el || !err) return !invalido;
  if (invalido) {
    el.classList.add('is-invalid', 'erro'); el.classList.remove('ok');
    err.textContent = '⚠ ' + msg; err.classList.add('visivel');
    return false;
  }
  el.classList.remove('is-invalid', 'erro'); el.classList.add('ok');
  err.classList.remove('visivel');
  return true;
}

function validarSecao1() {
  const nome       = document.getElementById('nome').value.trim();
  const email      = document.getElementById('email').value.trim();
  const nascimento = document.getElementById('nascimento');

  const ok1 = marcar('nome',  'err-nome',  !nome, 'Por favor, informe seu nome.');
  const ok2 = marcar('email', 'err-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'E-mail inválido.');

  let ok3 = true;
  if (nascimento && nascimento.value) {
    const hoje      = new Date().toISOString().split('T')[0];
    ok3 = marcar('nascimento', 'err-nascimento', nascimento.value > hoje, 'A data de nascimento não pode ser futura.');
  }

  return ok1 && ok2 && ok3;
}

function validarSecao2() {
  const tipo   = document.querySelector('input[name="tipo-doc"]:checked').value;
  const doc    = document.getElementById('documento').value;
  const valido = tipo === 'cpf' ? validarCPF(doc) : validarCNPJ(doc);
  return marcar('documento', 'err-doc', !valido,
    tipo === 'cpf' ? 'CPF inválido.' : 'CNPJ inválido.');
}

function validarSecao3() {
  const cep = document.getElementById('cep').value.replace(/\D/g, '');
  if (cep && cep.length < 8) { mostrarToast('CEP incompleto.', 'erro'); return false; }
  return true;
}

function alternarDoc(tipo) {
  const input = document.getElementById('documento');
  const info  = document.getElementById('info-cnpj');
  const label = document.getElementById('label-doc');
  if (!input) return;
  input.value = ''; input.classList.remove('ok', 'erro', 'is-invalid');
  if (tipo === 'cpf') {
    input.placeholder = '000.000.000-00'; input.maxLength = 14;
    document.getElementById('label-cpf').classList.add('ativo');
    document.getElementById('label-cnpj').classList.remove('ativo');
    document.querySelector('input[value="cpf"]').checked = true;
    label.innerHTML = 'Número do CPF <span class="text-danger">*</span>';
    if (info) info.style.display = 'none';
  } else {
    input.placeholder = 'AB.CDE.FGH/0001-00'; input.maxLength = 18;
    document.getElementById('label-cnpj').classList.add('ativo');
    document.getElementById('label-cpf').classList.remove('ativo');
    document.querySelector('input[value="cnpj"]').checked = true;
    label.innerHTML = 'Número do CNPJ <span class="text-danger">*</span>';
    if (info) info.style.display = 'block';
  }
}

function verificarForca(senha) {
  const cores = ['#e53935', '#ff9800', '#ffc107', '#43a047'];
  const nomes = ['Muito fraca', 'Fraca', 'Razoável', 'Forte'];
  let p = 0;
  if (senha.length >= 6)  p++;
  if (senha.length >= 10) p++;
  if (/[A-Z]/.test(senha) && /[0-9]/.test(senha)) p++;
  if (/[^A-Za-z0-9]/.test(senha)) p++;
  ['f1', 'f2', 'f3', 'f4'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.background = i < p ? cores[p - 1] : '#e0e0e0';
  });
  const lbl = document.getElementById('forca-label');
  if (lbl) {
    lbl.textContent = senha.length ? nomes[Math.max(0, p - 1)] : '';
    lbl.style.color  = senha.length ? cores[Math.max(0, p - 1)] : '';
  }
}


// ════════════════════════════════════════════════════════
//  PÁGINA: finalizar.html
// ════════════════════════════════════════════════════════

let painelAtual   = 1;
let freteValor    = 8.90;
let freteTipo     = 'Entrega Expressa';
let pagTipo       = 'PIX';
let desconto      = 0;
let cupomAplicado = false;

function irPara(n) {
  for (let i = 1; i <= 4; i++) {
    const c = document.getElementById('cs' + i);
    const l = document.getElementById('csl' + i);
    if (!c || !l) continue;
    c.classList.remove('ativo', 'feito');
    l.classList.remove('ativo', 'feito');
    if (i < n)        { c.classList.add('feito');  l.classList.add('feito'); }
    else if (i === n) { c.classList.add('ativo');  l.classList.add('ativo'); }
  }
  const saindo = document.getElementById('painel-' + painelAtual);
  if (saindo) saindo.classList.remove('ativo');
  painelAtual = n;
  const entrando = document.getElementById('painel-' + n);
  if (entrando) entrando.classList.add('ativo');
  if (n === 3) montarRevisao();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selecionarEntrega(el, tipo, preco) {
  document.querySelectorAll('.entrega-option').forEach(o => o.classList.remove('selecionado'));
  el.classList.add('selecionado');
  freteValor = preco;
  freteTipo  = el.querySelector('.entrega-title').textContent;
  atualizarSidebar();
}

function selecionarPag(el, tipo) {
  document.querySelectorAll('.pay-option').forEach(o => o.classList.remove('selecionado'));
  el.classList.add('selecionado');
  pagTipo = el.querySelector('.pay-title').textContent;
  ['pix', 'cartao', 'boleto', 'dinheiro'].forEach(t => {
    const d = document.getElementById('detalhe-' + t);
    if (d) { d.style.display = 'none'; d.classList.remove('show'); }
  });
  const alvo = document.getElementById('detalhe-' + tipo);
  if (alvo) { alvo.style.display = 'block'; alvo.classList.add('show'); }
  desconto = tipo === 'pix' ? 1 : 0;
  atualizarSidebar();
}

function mascaraCartao(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = v;
  const prev = document.getElementById('prev-numero');
  if (prev) prev.textContent = v || '•••• •••• •••• ••••';
}

function mascaraValidade(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
  input.value = v;
  const prev = document.getElementById('prev-validade');
  if (prev) prev.textContent = v || 'MM/AA';
}

function preencherParcelas(total) {
  const sel = document.getElementById('parcelas');
  if (!sel) return;
  sel.innerHTML = '';
  [1, 2, 3].forEach(n => {
    const val = (total / n).toFixed(2).replace('.', ',');
    sel.insertAdjacentHTML('beforeend',
      `<option value="${n}">${n}× de R$ ${val}${n === 1 ? ' (à vista)' : ' sem juros'}</option>`);
  });
}

function atualizarSidebar() {
  const carrinho = getCarrinho();
  const sub     = carrinho.reduce((a, i) => a + i.preco * (i.qty || 1), 0);
  const pixDesc = desconto === 1 ? sub * 0.05 : 0;
  const total   = sub + freteValor - pixDesc;

  const sbSub   = document.getElementById('sb-subtotal');
  const sbFrete = document.getElementById('sb-frete');
  const sbTotal = document.getElementById('sb-total');
  if (sbSub)   sbSub.textContent   = 'R$ ' + sub.toFixed(2).replace('.', ',');
  if (sbFrete) sbFrete.textContent = freteValor === 0 ? 'Grátis' : 'R$ ' + freteValor.toFixed(2).replace('.', ',');
  if (sbTotal) sbTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');

  preencherParcelas(total);
  renderSidebarItens(carrinho);
}

function renderSidebarItens(carrinho) {
  const el = document.getElementById('sidebar-itens');
  if (!el) return;
  if (!carrinho.length) {
    el.innerHTML = '<p class="text-muted small text-center py-3">Carrinho vazio</p>';
    return;
  }
  el.innerHTML = carrinho.map(item => `
    <div class="resumo-item">
      <img src="imagens/${item.img}" alt="${item.nome}"
           onerror="this.src='imagens/Design_sem_nome.png'">
      <div class="flex-grow-1">
        <p class="nome">${item.nome}</p>
        <p class="sub">Qtd: ${item.qty || 1}</p>
      </div>
      <span class="preco">R$ ${(item.preco * (item.qty || 1)).toFixed(2).replace('.', ',')}</span>
    </div>`).join('');
}

function montarRevisao() {
  const carrinho = getCarrinho();
  const sub     = carrinho.reduce((a, i) => a + i.preco * (i.qty || 1), 0);
  const pixDesc = desconto === 1 ? sub * 0.05 : 0;
  const total   = sub + freteValor - pixDesc;

  const itensEl = document.getElementById('revisao-itens');
  if (itensEl) {
    itensEl.innerHTML = carrinho.map(item => `
      <div class="resumo-item">
        <img src="imagens/${item.img}" alt="${item.nome}"
             onerror="this.src='imagens/Design_sem_nome.png'">
        <div class="flex-grow-1">
          <p class="nome">${item.nome}</p>
          <p class="sub">Qtd: ${item.qty || 1} × R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
        </div>
        <span class="preco">R$ ${(item.preco * (item.qty || 1)).toFixed(2).replace('.', ',')}</span>
      </div>`).join('');
  }

  const elLog  = document.getElementById('logradouro');
  const elNum  = document.getElementById('numero');
  const elBai  = document.getElementById('bairro');
  const elCid  = document.getElementById('cidade');
  const elUf   = document.getElementById('uf');
  const elCep  = document.getElementById('cep');
  const elComp = document.getElementById('complemento');
  const endEl  = document.getElementById('revisao-endereco');
  const tipEl  = document.getElementById('revisao-entrega-tipo');

  if (endEl) {
    endEl.textContent = elLog && elLog.value
      ? `${elLog.value}, ${elNum ? elNum.value : ''}${elComp && elComp.value ? ' - ' + elComp.value : ''} — ${elBai ? elBai.value : ''}, ${elCid ? elCid.value : ''}/${elUf ? elUf.value : ''} • CEP: ${elCep ? elCep.value : ''}`
      : 'Endereço não preenchido';
  }
  if (tipEl) tipEl.textContent = freteTipo + (freteValor === 0 ? ' (Grátis)' : ` — R$ ${freteValor.toFixed(2).replace('.', ',')}`);

  const revPag = document.getElementById('revisao-pagamento');
  if (revPag) revPag.textContent = pagTipo;

  const totSub   = document.getElementById('tot-subtotal');
  const totFrete = document.getElementById('tot-frete');
  const totDesc  = document.getElementById('tot-desconto');
  const totDescL = document.getElementById('tot-desconto-linha');
  const totTotal = document.getElementById('tot-total');

  if (totSub)   totSub.textContent   = 'R$ ' + sub.toFixed(2).replace('.', ',');
  if (totFrete) totFrete.textContent = freteValor === 0 ? 'Grátis' : 'R$ ' + freteValor.toFixed(2).replace('.', ',');
  if (totDescL) {
    if (pixDesc > 0) {
      totDescL.classList.remove('d-none');
      if (totDesc) totDesc.textContent = '- R$ ' + pixDesc.toFixed(2).replace('.', ',');
    } else {
      totDescL.classList.add('d-none');
    }
  }
  if (totTotal) totTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

const CUPONS = { 'NATIVUS10': 10, 'VERDE5': 5, 'BEMVINDO': 15 };

function aplicarCupom() {
  const cod   = document.getElementById('cupom-input').value.trim().toUpperCase();
  const okEl  = document.getElementById('cupom-ok');
  const errEl = document.getElementById('cupom-erro');
  if (okEl)  okEl.classList.add('d-none');
  if (errEl) errEl.classList.add('d-none');
  if (!cod) return;
  if (cupomAplicado) { mostrarToast('Já existe um cupom aplicado.', 'erro'); return; }
  if (CUPONS[cod]) {
    cupomAplicado = true;
    desconto += CUPONS[cod] / 100;
    const nomEl = document.getElementById('cupom-nome');
    if (nomEl) nomEl.textContent = cod + ' (' + CUPONS[cod] + '% off)';
    if (okEl) okEl.classList.remove('d-none');
    montarRevisao();
  } else {
    if (errEl) errEl.classList.remove('d-none');
  }
}

function confirmarPedido() {
  const num   = 'NTV-' + Math.floor(10000 + Math.random() * 90000);
  const numEl = document.getElementById('num-pedido');
  if (numEl) numEl.textContent = '#' + num;
  const msgs = {
    'Entrega Expressa': 'Sua entrega chegará em até 2 horas!',
    'Entrega Padrão':   'Sua entrega chegará em 1–2 dias úteis.',
    'Retirar na Loja':  'Seu pedido estará pronto para retirada em 30 minutos.'
  };
  const msgEl = document.getElementById('confirm-entrega-msg');
  if (msgEl) msgEl.textContent = msgs[freteTipo] || 'Em breve você receberá mais informações.';
  salvarCarrinho([]);
  irPara(4);
}

function copiarPix() {
  const txt = document.getElementById('pix-chave-text');
  if (!txt) return;
  navigator.clipboard.writeText(txt.textContent)
    .then(() => mostrarToast('Chave PIX copiada!'))
    .catch(() => {});
}


// ════════════════════════════════════════════════════════
//  DOMContentLoaded — inicializações automáticas por página
// ════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Todas as páginas: badge do carrinho ──
  atualizarBadgeCarrinho();

  // ── carrinho.html ──
  if (document.getElementById('lista-carrinho')) {
    renderizarCarrinhoCom();
  }

  // ── formulario.html ──
const nascimento = document.getElementById('nascimento');
if (nascimento) {
  nascimento.max = new Date().toISOString().split('T')[0];
  nascimento.addEventListener('change', function() {
    const hoje = new Date().toISOString().split('T')[0];
    const erro = document.getElementById('err-nascimento');
    if (this.value > hoje) {
      this.value = '';
      this.classList.add('is-invalid', 'erro');
      if (erro) erro.classList.add('visivel');
    } else {
      this.classList.remove('is-invalid', 'erro');
      if (erro) erro.classList.remove('visivel');
    }
  });
}

  const formCadastro = document.getElementById('formCadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', function(e) {
      e.preventDefault();
      const senha = document.getElementById('senha').value;
      const conf  = document.getElementById('conf-senha').value;
      const ok1 = marcar('senha',      'err-senha', senha.length < 6, 'A senha deve ter pelo menos 6 caracteres.');
      const ok2 = marcar('conf-senha', 'err-conf',  senha !== conf,   'As senhas não coincidem.');
      if (!ok1 || !ok2) return;
      mostrarToast('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => { window.location.href = 'arealogin.html'; }, 2000);
    });
  }

  // ── cadastrarproduto.html ──
  const formProduto = document.getElementById('formProduto');
  if (formProduto) {
    formProduto.addEventListener('submit', function(e) {
      e.preventDefault();
      const nome  = document.getElementById('nomeProduto').value.trim();
      const preco = document.getElementById('precoProduto').value.trim();
      if (!nome)  { alert('Informe o nome do produto.'); return; }
      if (!preco) { alert('Informe o preço do produto.'); return; }
      mostrarToast('Produto "' + nome + '" cadastrado com sucesso!');
      setTimeout(() => {
        formProduto.reset();
        const prev = document.getElementById('preco-preview');
        if (prev) prev.textContent = '';
      }, 1000);
    });
  }

  // ── funcionario.html ──
  const funcForm = document.getElementById('funcForm');
  if (funcForm) {
    funcForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const v = document.getElementById('tipo').value;
      if      (v === 'cadastro')   window.location.href = 'cadastrarproduto.html';
      else if (v === 'clienteger') window.location.href = 'formulario.html';
      else alert('Por favor, selecione uma ferramenta.');
    });
  }

  // ── arealogin.html ──
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const tipo = document.getElementById('tipo').value;
      if      (tipo === 'cliente')     window.location.href = 'cliente.html';
      else if (tipo === 'funcionario') window.location.href = 'funcionario.html';
      else alert('Por favor, selecione um tipo de usuário.');
    });
  }

  // ── finalizar.html ──
  if (document.getElementById('painel-1')) {
    ['cartao', 'boleto', 'dinheiro'].forEach(t => {
      const d = document.getElementById('detalhe-' + t);
      if (d) d.style.display = 'none';
    });
    atualizarSidebar();

    const cardNome = document.getElementById('card-nome');
    if (cardNome) {
      cardNome.addEventListener('input', function() {
        const prev = document.getElementById('prev-nome');
        if (prev) prev.textContent = this.value.toUpperCase() || 'NOME DO TITULAR';
      });
    }

    const cardCvv = document.getElementById('card-cvv');
    if (cardCvv) {
      cardCvv.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
      });
    }
  }

});
