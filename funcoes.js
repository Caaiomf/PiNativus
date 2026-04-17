// ========================================================
//  NATIVUS — funcoes.js
//  CPF · CNPJ alfanumérico RFB 2026 · CEP · Carrinho
// ========================================================

// ---------- CPF ----------
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

// ---------- CNPJ (numérico + alfanumérico novo RFB julho/2026) ----------
function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[\.\-\/\s]/g, '').toUpperCase();
  if (cnpj.length !== 14) return false;
  if (/^(.)\1{13}$/.test(cnpj)) return false;
  function val(c) { return /\d/.test(c) ? +c : c.charCodeAt(0) - 55; }
  function calcDigito(base, pesos) {
    const soma = base.split('').reduce((a, c, i) => a + val(c) * pesos[i], 0);
    const r = soma % 11; return r < 2 ? 0 : 11 - r;
  }
  return calcDigito(cnpj.slice(0,12), [5,4,3,2,9,8,7,6,5,4,3,2]) === +cnpj[12] &&
         calcDigito(cnpj.slice(0,13), [6,5,4,3,2,9,8,7,6,5,4,3,2]) === +cnpj[13];
}

// ---------- Máscara CPF / CNPJ ----------
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

// ---------- Máscara Telefone ----------
function formatarTelefone(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length <= 10) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  else                v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  input.value = v.replace(/-$/, '');
}

// ---------- Máscara Preço (R$ 0,00) ----------
function formatarPreco(input) {
  let v = input.value.replace(/\D/g, '');
  if (!v) { input.value = ''; return; }
  v = (parseInt(v, 10) / 100).toFixed(2);
  input.value = 'R$ ' + v.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

// ---------- Máscara CEP ----------
function formatarCEP(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 8);
  if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
  input.value = v;
  if (v.replace(/\D/g, '').length === 8) buscarCEP(v);
}

// ---------- Busca CEP via ViaCEP ----------
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
    if (campos.bairro)     campos.bairro.value  = data.bairro    || '';
    if (campos.cidade)     campos.cidade.value  = data.localidade|| '';
    if (campos.uf)         campos.uf.value      = data.uf        || '';
    const numEl = document.getElementById('numero');
    if (numEl) numEl.focus();
    mostrarToast('Endereço preenchido automaticamente!');
  } catch { mostrarToast('Erro ao buscar CEP. Verifique sua conexão.', 'erro'); }
}

// ========================================================
//  CARRINHO — localStorage (sem banco de dados)
// ========================================================
const IMG_BASE = 'imagens/';

function getCarrinho() {
  return JSON.parse(localStorage.getItem('nativus_carrinho') || '[]');
}
function salvarCarrinho(itens) {
  localStorage.setItem('nativus_carrinho', JSON.stringify(itens));
}

// Adiciona ao carrinho — redireciona se redirect=true
function adicionarAoCarrinho(nome, preco, img, redirecionar) {
  const carrinho = getCarrinho();
  const idx = carrinho.findIndex(i => i.nome === nome);
  if (idx >= 0) carrinho[idx].qty = (carrinho[idx].qty || 1) + 1;
  else          carrinho.push({ nome, preco, img, qty: 1 });
  salvarCarrinho(carrinho);
  atualizarBadgeCarrinho();
  if (redirecionar) {
    window.location.href = 'carrinho.html';
  } else {
    mostrarToast('"' + nome + '" adicionado ao carrinho!');
  }
}

function removerDoCarrinho(index) {
  const carrinho = getCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);
  if (typeof renderizarCarrinhoCom === 'function') renderizarCarrinhoCom();
  else renderizarCarrinho();
  atualizarBadgeCarrinho();
}

function alterarQty(index, delta) {
  const carrinho = getCarrinho();
  if (!carrinho[index]) return;
  carrinho[index].qty = Math.max(1, (carrinho[index].qty || 1) + delta);
  salvarCarrinho(carrinho);
  if (typeof renderizarCarrinhoCom === 'function') renderizarCarrinhoCom();
  atualizarBadgeCarrinho();
}

function limparCarrinho() {
  if (confirm('Deseja esvaziar o carrinho?')) {
    salvarCarrinho([]);
    if (typeof renderizarCarrinhoCom === 'function') renderizarCarrinhoCom();
    atualizarBadgeCarrinho();
  }
}

function atualizarBadgeCarrinho() {
  const badge = document.getElementById('badge-carrinho');
  if (!badge) return;
  const qtd = getCarrinho().reduce((a, i) => a + (i.qty || 1), 0);
  badge.textContent = qtd;
  badge.style.display = qtd > 0 ? 'inline-flex' : 'none';
}

function renderizarCarrinho() {
  const lista   = document.getElementById('lista-carrinho');
  const totalEl = document.getElementById('total-carrinho');
  if (!lista) return;
  const carrinho = getCarrinho();
  lista.innerHTML = '';
  if (carrinho.length === 0) {
    lista.innerHTML = '<p style="text-align:center;color:#888;padding:50px 0;font-size:18px;">🛒 Seu carrinho está vazio.</p>';
    if (totalEl) totalEl.textContent = 'Total: R$ 0,00';
    return;
  }
  let total = 0;
  carrinho.forEach((item, i) => {
    const sub = item.preco * (item.qty || 1);
    total += sub;
    lista.insertAdjacentHTML('beforeend', `
      <div class="item-carrinho">
        <div class="item-info">
          <img src="${IMG_BASE}${item.img}" alt="${item.nome}" onerror="this.src='imagens/Design sem nome.png'">
          <div>
            <h3>${item.nome}</h3>
            <p>Preço: R$ ${item.preco.toFixed(2).replace('.', ',')} &nbsp;|&nbsp; Qtd: <strong>${item.qty || 1}</strong></p>
            <p>Subtotal: <strong>R$ ${sub.toFixed(2).replace('.', ',')}</strong></p>
          </div>
        </div>
        <button class="btn-remover" onclick="removerDoCarrinho(${i})" title="Remover item">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`);
  });
  if (totalEl) totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ---------- Toast ----------
function mostrarToast(msg, tipo) {
  let t = document.getElementById('nativus-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'nativus-toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
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

function cadastro() { alert('Você foi cadastrado!'); }
