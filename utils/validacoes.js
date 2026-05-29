import { hojeISO, somenteDigitos } from "./formatacao.js";

export function validarCPF(cpf) {
  cpf = somenteDigitos(cpf);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

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

export function validarCNPJ(cnpj) {
  cnpj = String(cnpj || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cnpj.length !== 14 || /^([A-Z0-9])\1{13}$/.test(cnpj)) return false;
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) return false;

  const valorCaracter = (caracter) => caracter.charCodeAt(0) - 48;

  const calcularDigito = (tamanho, pesos) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += valorCaracter(cnpj[i]) * pesos[i];
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiro = calcularDigito(12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const segundo = calcularDigito(13, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return primeiro === Number(cnpj[12]) && segundo === Number(cnpj[13]);
}

export function validarCadastro(dados, usuarios) {
  const erros = {};
  const telefoneDigitos = somenteDigitos(dados.telefone);
  const cpfDigitos = somenteDigitos(dados.cpf);
  const cnpjNormalizado = String(dados.cnpj || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const cepDigitos = somenteDigitos(dados.cep);
  const contatosValidos = ["whatsapp", "email", "telefone"];
  const tiposPessoaValidos = ["fisica", "juridica"];

  if (!dados.nome || dados.nome.trim().length < 3) erros.nome = "Informe o nome completo.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email || "")) erros.email = "Informe um e-mail valido.";
  if (usuarios.some((u) => u.email === String(dados.email || "").toLowerCase())) erros.email = "Este e-mail ja esta cadastrado.";
  if (!tiposPessoaValidos.includes(dados.tipoPessoa)) erros.tipoPessoa = "Selecione o tipo de pessoa.";
  if (dados.tipoPessoa === "fisica" && !validarCPF(cpfDigitos)) erros.cpf = "Informe um CPF valido.";
  if (dados.tipoPessoa === "juridica" && !validarCNPJ(cnpjNormalizado)) erros.cnpj = "Informe um CNPJ valido.";
  if (!dados.nascimento) erros.nascimento = "Informe a data de nascimento.";
  else if (dados.nascimento > hojeISO()) erros.nascimento = "A data de nascimento nao pode ser maior que hoje.";
  if (![10, 11].includes(telefoneDigitos.length)) erros.telefone = "Informe um telefone com DDD.";
  if (cepDigitos.length !== 8) erros.cep = "Informe um CEP com 8 numeros.";
  if (!dados.endereco || dados.endereco.trim().length < 3) erros.endereco = "Informe o endereco.";
  if (!dados.numero || !somenteDigitos(dados.numero)) erros.numero = "Informe o numero.";
  if (!dados.referencia || dados.referencia.trim().length < 3) erros.referencia = "Informe um ponto de referencia.";
  if (!contatosValidos.includes(dados.contatoPreferido)) erros.contatoPreferido = "Escolha uma forma de contato.";
  if (!dados.senha || dados.senha.length < 6) erros.senha = "A senha deve ter pelo menos 6 caracteres.";
  if (dados.senha !== dados.confirmarSenha) erros.confirmarSenha = "As senhas nao coincidem.";
  if (dados.aceitarTermos !== "sim") erros.aceitarTermos = "Aceite os termos para continuar.";
  if (dados.observacoes && dados.observacoes.length > 180) erros.observacoes = "As observacoes devem ter ate 180 caracteres.";

  return erros;
}
