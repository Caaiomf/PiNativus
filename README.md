# PiNativus Node.js - Guia completo de estudo

Este projeto e uma loja simples chamada **Nativus**, feita com **Node.js + Express**.
Ele foi montado como um sistema de mercado com produtos organicos, cadastro de usuario,
login, carrinho, checkout e area de funcionario.

A ideia principal do projeto e praticar:

- HTML gerado pelo servidor.
- CSS com Bootstrap.
- JavaScript no navegador.
- Node.js.
- Express.
- Rotas `GET` e `POST`.
- Formularios.
- Cookies.
- Sessoes.
- Separacao de codigo em arquivos.
- Upload de imagens com `multer`.
- Leitura e escrita de arquivo JSON com `fs`.

Este README foi escrito para servir como material de revisao para estudantes que ja
viram HTML, CSS, JavaScript, Node, Express e `cookie-parser`, mas ainda estao
aprendendo como tudo se encaixa em um projeto completo.

---

## 1. Como rodar o projeto

Entre na pasta do projeto:

```bash
cd "C:\Users\caiof\Documents\Pi_mercado\layout 3\PiNativus"
```

Instale as dependencias:

```bash
npm install
```

Inicie o servidor:

```bash
npm start
```

Depois abra no navegador:

```text
http://localhost:3000
```

Se aparecer `Servidor rodando em http://localhost:3000`, o Express iniciou certo.

---

## 2. Login para testar

Usuarios comuns podem criar conta em:

```text
/cadastro
```

Depois podem entrar em:

```text
/login
```

Existe tambem um funcionario criado automaticamente pelo sistema:

```text
E-mail: funcionario@nativus.com.br
Senha: Nativus@123
Tipo de acesso: Funcionario
```

Esse funcionario consegue acessar:

```text
/funcionario
/cadastroProduto
/listaProdutos
```

---

## 3. Visao geral do que o projeto faz

O projeto tem dois tipos principais de usuario:

1. Cliente.
2. Funcionario.

O cliente pode:

- Ver os produtos da loja.
- Buscar produtos pelo nome.
- Adicionar produtos ao carrinho.
- Alterar quantidade no carrinho.
- Remover produtos do carrinho.
- Criar conta.
- Fazer login.
- Finalizar a compra.
- Escolher entrega.
- Escolher forma de pagamento.
- Aplicar cupom.

O funcionario pode:

- Fazer login como funcionario.
- Acessar o painel do funcionario.
- Cadastrar produto.
- Enviar imagem para o produto.
- Listar produtos.
- Remover produtos.

Importante: este projeto e didatico. Ele nao e um e-commerce real de producao.
Alguns dados sao salvos de forma simples e algumas regras de seguranca ainda sao
basicas.

---

## 4. Estrutura de pastas

```text
PiNativus
  index.js
  sessao.js
  package.json
  README.md
  vercel.json
  dados
    produtos.js
    usuarios.js
  data
    users.json
  paginas
    cadastro.js
    carrinho.js
    finalizar.js
    funcionario.js
    layout.js
    login.js
    loja.js
  public
    imagens
      ...
      uploads
        ...
  utils
    formatacao.js
    validacoes.js
```

Resumo de cada parte:

| Arquivo ou pasta | Para que serve |
| --- | --- |
| `index.js` | Arquivo principal. Cria o servidor Express, configura middlewares e define as rotas. |
| `sessao.js` | Funcoes ligadas a login, permissao, carrinho, checkout e calculo de totais. |
| `dados/produtos.js` | Lista inicial de produtos, entregas, pagamentos e cupons. |
| `dados/usuarios.js` | Carrega e salva usuarios no arquivo `data/users.json`. |
| `paginas/` | Cada arquivo gera o HTML de uma tela. |
| `utils/formatacao.js` | Funcoes pequenas para formatar dinheiro, limpar numeros, criar id e escapar HTML. |
| `utils/validacoes.js` | Regras de validacao do cadastro, incluindo CPF. |
| `public/imagens/` | Imagens usadas pelo site. |
| `public/imagens/uploads/` | Imagens enviadas no cadastro de produto. |
| `package.json` | Informacoes do projeto, scripts e dependencias. |
| `vercel.json` | Configuracao para deploy na Vercel. |

---

## 5. Ideia principal da arquitetura

Este projeto nao usa React, Vue, Next ou banco de dados.
Ele usa uma arquitetura simples:

```text
Navegador
  envia requisicao HTTP
Express recebe
  roda middlewares
  chama uma rota
  a rota chama uma funcao render
  a funcao render monta HTML
Express envia o HTML pronto
Navegador mostra a pagina
```

Exemplo:

1. Usuario abre `/index.html`.
2. Express chama a rota da loja.
3. A rota executa `renderIndex(req)`.
4. `renderIndex` cria uma string HTML com os produtos.
5. O servidor envia essa string para o navegador.

Esse estilo e chamado de **renderizacao no servidor**.

---

## 6. `package.json`

O arquivo `package.json` descreve o projeto.

Trecho importante:

```json
{
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  },
  "dependencies": {
    "cookie-parser": "^1.4.7",
    "express": "^5.1.0",
    "express-session": "^1.18.2",
    "multer": "^2.1.1"
  }
}
```

### `"main": "index.js"`

Indica que o arquivo principal do projeto e `index.js`.

### `"type": "module"`

Permite usar `import` e `export` no Node.js:

```js
import express from "express";
export function minhaFuncao() {}
```

Sem isso, o Node normalmente usaria o formato antigo:

```js
const express = require("express");
module.exports = minhaFuncao;
```

### `"scripts"`

Scripts sao atalhos para comandos.

Quando voce roda:

```bash
npm start
```

o Node executa:

```bash
node index.js
```

### `"dependencies"`

Sao bibliotecas externas usadas pelo projeto:

- `express`: cria o servidor e as rotas.
- `cookie-parser`: facilita ler cookies.
- `express-session`: cria sessoes.
- `multer`: recebe upload de arquivos.

---

## 7. O que e `import`?

`import` serve para trazer codigo de outro arquivo ou biblioteca.

Exemplo:

```js
import express from "express";
```

Isso significa:

> Pegue a biblioteca `express` instalada no `node_modules` e coloque ela na variavel `express`.

Outro exemplo:

```js
import { validarCadastro } from "./utils/validacoes.js";
```

Isso significa:

> Pegue a funcao `validarCadastro` que foi exportada no arquivo `utils/validacoes.js`.

Quando o import vem sem `./`, normalmente e biblioteca:

```js
import express from "express";
```

Quando vem com `./` ou `../`, e arquivo do proprio projeto:

```js
import { produtos } from "./dados/produtos.js";
import { layout } from "../paginas/layout.js";
```

---

## 8. Imports principais do `index.js`

No inicio do `index.js`, aparecem varios imports:

```js
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
```

### `express`

Serve para criar o servidor web.

Com Express voce faz:

```js
const server = express();
```

Depois cria rotas:

```js
server.get("/login", (req, res) => {
  res.send("Pagina de login");
});
```

Express trabalha com duas coisas principais:

- `req`: requisicao, ou seja, o que veio do navegador.
- `res`: resposta, ou seja, o que o servidor vai devolver.

### `cookie-parser`

Serve para ler cookies enviados pelo navegador.

Sem ele, trabalhar com cookies fica mais manual.

Com ele, o projeto consegue acessar:

```js
req.cookies
```

No projeto, ele e usado para guardar e ler o ultimo acesso:

```js
req.ultimoAcesso = req.cookies?.ultimoAcesso;
res.cookie("ultimoAcesso", new Date().toLocaleString("pt-BR"), { sameSite: "lax" });
```

### `express-session`

Serve para criar uma sessao para cada visitante.

A sessao e usada para guardar informacoes temporarias do usuario enquanto ele navega:

- usuario logado;
- carrinho;
- opcoes do checkout.

Exemplo no projeto:

```js
req.session.dadosLogin = {
  id: usuario.id,
  nome: usuario.nome,
  email: usuario.email,
  tipo: usuario.tipo,
  logado: true
};
```

Isso quer dizer:

> Guarde na sessao que este visitante esta logado.

### `crypto`

`crypto` e uma biblioteca nativa do Node.
Ela serve para operacoes relacionadas a criptografia, ids e valores aleatorios.

No projeto, ela e usada para criar ids unicos:

```js
crypto.randomUUID()
```

Exemplo de resultado:

```text
7c57d9d8-1a2b-4df4-9a13-2fc7c41c53a1
```

Esse id e usado para usuarios.

### `fs`

`fs` significa **file system**, ou seja, sistema de arquivos.

Ele serve para mexer em arquivos e pastas do computador/servidor.

Com `fs`, voce pode:

- criar pasta;
- ler arquivo;
- escrever arquivo;
- apagar arquivo;
- verificar se algo existe.

No `index.js`, ele aparece assim:

```js
import fs from "fs";
```

Esse import usa a versao sincronizada do `fs`.

No projeto ele e usado para criar a pasta de uploads:

```js
fs.mkdirSync(pastaUploads, { recursive: true });
```

Explicando:

- `mkdirSync`: cria uma pasta.
- `Sync`: quer dizer que o Node espera a pasta ser criada antes de continuar.
- `recursive: true`: se alguma pasta do caminho nao existir, ele cria tambem.

Exemplo:

```text
public/imagens/uploads
```

Se `uploads` nao existir, ele cria.

Se `public/imagens` tambem nao existisse, com `recursive: true` ele poderia criar o caminho inteiro.

Tambem e usado para apagar uma imagem enviada se o formulario tiver erro:

```js
fs.unlinkSync(req.file.path);
```

Explicando:

- `unlinkSync`: apaga um arquivo.
- `req.file.path`: caminho do arquivo que acabou de ser enviado.

Por que isso foi colocado?

Porque se o funcionario envia uma imagem, mas esquece nome, categoria ou preco, o produto nao deve ser cadastrado.
Se a imagem ja foi salva, ela ficaria perdida na pasta.
Entao o sistema apaga a imagem para nao deixar arquivo inutil.

### `multer`

`multer` e uma biblioteca usada para upload de arquivos no Express.

Formularios normais enviam texto facilmente:

```html
<input name="nome">
```

Mas para enviar arquivo, o formulario precisa usar:

```html
enctype="multipart/form-data"
```

E o Express sozinho nao trata esse tipo de arquivo de forma simples.
Ai entra o `multer`.

No projeto, o funcionario pode enviar imagem no cadastro de produto:

```html
<input class="form-control" id="imagemArquivo" name="imagemArquivo" type="file" accept="image/*">
```

O `multer` recebe esse arquivo:

```js
uploadProduto.single("imagemArquivo")
```

Explicando:

- `single`: recebe um unico arquivo.
- `"imagemArquivo"`: precisa ser igual ao `name` do input do HTML.

Por que isso foi colocado?

Porque o projeto permite que o funcionario cadastre produto com uma imagem enviada do computador.

### `path`

`path` e uma biblioteca nativa do Node para trabalhar com caminhos de arquivo.

Em vez de montar caminhos manualmente assim:

```js
"public/imagens/uploads"
```

o projeto usa:

```js
path.join(__dirname, "public", "imagens", "uploads");
```

Por que isso e melhor?

Porque Windows usa `\` em caminhos e Linux/Mac geralmente usam `/`.
O `path.join` monta o caminho correto para o sistema operacional.

Tambem evita erros com barras faltando ou sobrando.

No projeto, `path` tambem e usado para separar nome e extensao do arquivo:

```js
const extensao = path.extname(file.originalname).toLowerCase();
const nomeBase = path.basename(file.originalname, extensao);
```

Exemplo:

```text
Arquivo original: "Foto Banana.JPG"
path.extname(...)  -> ".jpg"
path.basename(...) -> "Foto Banana"
```

Depois o projeto limpa esse nome para salvar de forma mais segura.

### `fileURLToPath`

Esse e um detalhe importante de projetos Node com `"type": "module"`.

Em projetos antigos com `require`, existia automaticamente:

```js
__dirname
```

`__dirname` significa:

> A pasta onde o arquivo atual esta.

Mas em ES Modules, usando `import`, o `__dirname` nao existe automaticamente.
Entao o projeto recria esse valor com:

```js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

Vamos quebrar em partes:

```js
import.meta.url
```

Retorna a URL do arquivo atual:

```text
file:///C:/Users/caiof/Documents/Pi_mercado/layout%203/PiNativus/index.js
```

Depois:

```js
fileURLToPath(import.meta.url)
```

Transforma essa URL em caminho normal:

```text
C:\Users\caiof\Documents\Pi_mercado\layout 3\PiNativus\index.js
```

Depois:

```js
path.dirname(...)
```

Pega apenas a pasta:

```text
C:\Users\caiof\Documents\Pi_mercado\layout 3\PiNativus
```

Por que isso foi colocado?

Porque o projeto precisa saber onde esta a pasta principal para montar caminhos como:

```text
public/imagens/uploads
```

Sem isso, salvar imagem ou servir imagens estaticas ficaria mais dificil.

---

## 9. Imports dos arquivos do proprio projeto

Depois dos imports de bibliotecas, o `index.js` importa partes do proprio projeto:

```js
import { adicionarProduto, entregas, pagamentos, produtos, removerProduto } from "./dados/produtos.js";
import { carregarUsuarios, salvarUsuarios } from "./dados/usuarios.js";
import { calcularTotais, carrinhoDaSessao, verificarFuncionario, verificarUsuarioLogado } from "./sessao.js";
import { criarId, parsePrecoCentavos, somenteDigitos } from "./utils/formatacao.js";
import { validarCadastro } from "./utils/validacoes.js";
```

Esses imports mostram que o `index.js` nao faz tudo sozinho.
Ele chama funcoes de outros arquivos.

Isso ajuda a organizar o codigo:

- dados ficam em `dados/`;
- regras de sessao ficam em `sessao.js`;
- formatacoes ficam em `utils/formatacao.js`;
- validacoes ficam em `utils/validacoes.js`;
- telas ficam em `paginas/`.

Tambem sao importadas funcoes que renderizam paginas:

```js
import { renderCadastro } from "./paginas/cadastro.js";
import { renderCarrinho } from "./paginas/carrinho.js";
import { renderCadastroProduto, renderFuncionario, renderListaProdutos } from "./paginas/funcionario.js";
import { renderFinalizar, renderPedidoConfirmado } from "./paginas/finalizar.js";
import { renderIndex } from "./paginas/loja.js";
import { renderLogin } from "./paginas/login.js";
```

Cada `render...` retorna uma string HTML.

Exemplo:

```js
res.send(renderLogin(req));
```

Isso significa:

> Gere o HTML da tela de login e envie para o navegador.

---

## 10. Variaveis iniciais do servidor

No `index.js`:

```js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const host = "0.0.0.0";
const porta = process.env.PORT || 3000;
const server = express();
const pastaUploads = path.join(__dirname, "public", "imagens", "uploads");
```

### `__dirname`

Guarda a pasta do projeto.

### `host = "0.0.0.0"`

Significa que o servidor aceita conexoes vindas de qualquer interface de rede.
Em ambiente local, voce continua acessando por:

```text
localhost:3000
```

### `porta = process.env.PORT || 3000`

Define a porta do servidor.

Se existir uma variavel de ambiente chamada `PORT`, usa ela.
Se nao existir, usa `3000`.

Isso e importante para deploy, porque plataformas como Vercel/Render/Heroku podem escolher a porta.

### `server = express()`

Cria a aplicacao Express.

Depois disso voce pode usar:

```js
server.use(...)
server.get(...)
server.post(...)
server.listen(...)
```

### `pastaUploads`

Monta o caminho onde as imagens enviadas serao salvas:

```text
public/imagens/uploads
```

---

## 11. Configuracao do upload com `multer`

No `index.js`:

```js
const uploadProduto = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, pastaUploads);
    },
    filename(req, file, cb) {
      ...
      cb(null, `${Date.now()}-${nomeBase}${extensao}`);
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Envie somente arquivos de imagem."));
  }
});
```

Essa configuracao responde tres perguntas:

1. Onde salvar o arquivo?
2. Qual nome dar ao arquivo?
3. Que tipo/tamanho de arquivo aceitar?

### `storage`

Define como o arquivo sera salvo.

### `destination`

Define a pasta de destino:

```js
cb(null, pastaUploads);
```

`cb` significa callback.
Aqui o `multer` pergunta:

> Posso salvar onde?

E o codigo responde:

> Pode salvar em `pastaUploads`.

### `filename`

Define o nome final do arquivo.

O projeto pega a extensao:

```js
const extensao = path.extname(file.originalname).toLowerCase();
```

Pega o nome sem extensao:

```js
const nomeBase = path.basename(file.originalname, extensao)
```

Depois limpa o nome:

```js
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g, "")
.replace(/[^a-z0-9]+/g, "-")
.replace(/(^-|-$)/g, "")
```

Essa limpeza faz coisas como:

```text
"Maçã Orgânica.JPG" -> "maca-organica.jpg"
```

Depois adiciona `Date.now()` no inicio:

```js
`${Date.now()}-${nomeBase}${extensao}`
```

Exemplo:

```text
1779291937411-maca-organica.jpg
```

Por que usar `Date.now()`?

Para evitar que dois arquivos com o mesmo nome sobrescrevam um ao outro.

### `limits`

```js
limits: { fileSize: 2 * 1024 * 1024 }
```

Define limite de 2 MB.

Conta:

```text
2 * 1024 * 1024 bytes = 2 MB
```

### `fileFilter`

```js
if (file.mimetype.startsWith("image/")) cb(null, true);
else cb(new Error("Envie somente arquivos de imagem."));
```

Verifica se o arquivo e uma imagem.

Exemplos aceitos:

```text
image/png
image/jpeg
image/webp
```

Se nao for imagem, o upload e recusado.

---

## 12. Middleware `receberImagemProduto`

```js
function receberImagemProduto(req, res, next) {
  uploadProduto.single("imagemArquivo")(req, res, (erro) => {
    if (erro) {
      res.status(400).send(renderCadastroProduto(req, erro.message || "Nao foi possivel enviar a imagem."));
      return;
    }
    next();
  });
}
```

Essa funcao e um middleware.

Middleware e uma funcao que roda entre a requisicao chegar e a rota terminar.

Ela recebe:

- `req`: requisicao.
- `res`: resposta.
- `next`: funcao que manda continuar para a proxima etapa.

Aqui ela faz:

1. Tenta receber a imagem enviada no campo `imagemArquivo`.
2. Se der erro, mostra a tela de cadastro de produto com mensagem.
3. Se der certo, chama `next()` para continuar a rota.

Ela e usada nesta rota:

```js
server.post("/cadastroProduto", verificarFuncionario, receberImagemProduto, (req, res) => {
  ...
});
```

A ordem importa:

1. `verificarFuncionario`: ve se o usuario e funcionario.
2. `receberImagemProduto`: recebe a imagem.
3. Funcao final: cadastra o produto.

---

## 13. Middlewares globais

No Express, `server.use(...)` registra middlewares.

Eles rodam antes das rotas.

### Sessao

```js
server.use(session({
  secret: process.env.SESSION_SECRET || "NativusSessaoSimples",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60, sameSite: "lax" }
}));
```

Isso ativa sessoes.

#### `secret`

E uma chave usada para assinar o cookie da sessao.

Em producao, o ideal e usar uma variavel de ambiente:

```text
SESSION_SECRET
```

#### `resave: false`

Evita salvar a sessao de novo se nada mudou.

#### `saveUninitialized: false`

Evita criar sessao vazia para visitante que ainda nao usou nada.

#### `cookie.maxAge`

```js
1000 * 60 * 60
```

Significa 1 hora.

Conta:

```text
1000 ms = 1 segundo
1000 * 60 = 1 minuto
1000 * 60 * 60 = 1 hora
```

#### `sameSite: "lax"`

Ajuda a proteger o cookie em alguns tipos de requisicao vindas de outros sites.

### `express.urlencoded`

```js
server.use(express.urlencoded({ extended: true }));
```

Permite ler dados enviados por formularios HTML.

Sem isso, `req.body` ficaria vazio em formularios `POST`.

Exemplo:

```html
<input name="email">
```

No backend:

```js
req.body.email
```

### `cookieParser`

```js
server.use(cookieParser());
```

Permite acessar:

```js
req.cookies
```

No projeto, e usado para o cookie `ultimoAcesso`.

---

## 14. Servir imagens estaticas

```js
server.use("/imagens", express.static(path.join(__dirname, "public", "imagens"), imageStaticOptions));
```

Isso significa:

> Quando alguem acessar `/imagens/...`, procure o arquivo dentro da pasta `public/imagens`.

Exemplo:

```html
<img src="/imagens/banana_prata.jpg">
```

O Express procura:

```text
public/imagens/banana_prata.jpg
```

### Por que usar `express.static`?

Porque arquivos como imagens, CSS estatico e scripts publicos nao precisam de uma rota manual para cada um.

### Por que existe `Cache-Control: no-store`?

O projeto tem:

```js
const imageStaticOptions = {
  etag: false,
  cacheControl: false,
  setHeaders(res) {
    res.setHeader("Cache-Control", "no-store");
  }
};
```

Isso manda o navegador nao guardar cache das imagens.

Por que isso ajuda?

Durante desenvolvimento, se voce troca uma imagem, o navegador pode continuar mostrando a antiga por cache.
Com `no-store`, ele sempre busca de novo.

---

## 15. Cookie de ultimo acesso

```js
server.use((req, res, next) => {
  req.ultimoAcesso = req.cookies?.ultimoAcesso;
  res.cookie("ultimoAcesso", new Date().toLocaleString("pt-BR"), { sameSite: "lax" });
  next();
});
```

Esse middleware faz duas coisas:

1. Le o cookie antigo:

```js
req.cookies?.ultimoAcesso
```

2. Grava um novo cookie com a data atual:

```js
res.cookie("ultimoAcesso", new Date().toLocaleString("pt-BR"), { sameSite: "lax" });
```

Depois a pagina mostra no rodape:

```js
Ultimo acesso: ${escapar(req.ultimoAcesso || "Primeiro acesso")}
```

### Cookie vs sessao

Cookie:

- Fica no navegador.
- E enviado ao servidor a cada requisicao.
- Neste projeto guarda o ultimo acesso.

Sessao:

- Os dados ficam no servidor.
- O navegador guarda apenas um identificador da sessao.
- Neste projeto guarda login, carrinho e checkout.

---

## 16. Rotas da loja

### Rota da pagina inicial

```js
server.get(["/", "/index", "/index.html"], (req, res) => {
  res.send(renderIndex(req));
});
```

Essa rota aceita tres caminhos:

- `/`
- `/index`
- `/index.html`

Ela chama `renderIndex(req)`, que esta em `paginas/loja.js`.

### Redirect de cliente antigo

```js
server.get(["/cliente", "/cliente.html"], (req, res) => {
  res.redirect("/index.html");
});
```

Se alguem acessar `/cliente`, o sistema manda para `/index.html`.

Isso provavelmente foi colocado para manter compatibilidade com um nome antigo de pagina.

---

## 17. Login

### Mostrar tela de login

```js
server.get("/login", (req, res) => {
  res.send(renderLogin(req));
});
```

Quando o navegador acessa `/login`, o servidor envia o HTML da tela.

### Receber login

```js
server.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const senha = String(req.body.senha || "");
  const tipo = req.body.tipo === "funcionario" ? "funcionario" : "cliente";
  const usuarios = await carregarUsuarios();
  const usuario = usuarios.find((u) => u.email === email);
  ...
});
```

Passo a passo:

1. Pega o e-mail enviado no formulario.
2. Remove espacos com `trim()`.
3. Converte para minusculo com `toLowerCase()`.
4. Pega a senha.
5. Verifica se o tipo e funcionario ou cliente.
6. Carrega usuarios do arquivo JSON.
7. Procura usuario com aquele e-mail.

Se o e-mail ou senha estiver errado:

```js
res.send(renderLogin(req, "E-mail ou senha invalido."));
return;
```

Se o usuario existe, mas o tipo escolhido esta errado:

```js
res.send(renderLogin(req, "Esta conta nao tem permissao para este tipo de acesso."));
return;
```

Se esta tudo certo, salva dados na sessao:

```js
req.session.dadosLogin = {
  id: usuario.id,
  nome: usuario.nome,
  email: usuario.email,
  tipo: usuario.tipo,
  logado: true
};
```

Depois redireciona:

```js
res.redirect(usuario.tipo === "funcionario" ? "/funcionario" : "/index.html");
```

Funcionario vai para `/funcionario`.
Cliente vai para `/index.html`.

---

## 18. Cadastro de usuario

### Mostrar formulario

```js
server.get("/cadastro", (req, res) => {
  res.send(renderCadastro(req));
});
```

### Receber cadastro

```js
server.post("/cadastro", async (req, res) => {
  const dados = {
    nome: String(req.body.nome || "").trim(),
    email: String(req.body.email || "").trim().toLowerCase(),
    ...
  };
});
```

O projeto monta um objeto `dados` com os campos do formulario.

Depois carrega os usuarios:

```js
const usuarios = await carregarUsuarios();
```

Depois valida:

```js
const erros = validarCadastro(dados, usuarios);
```

Se tiver erro:

```js
res.send(renderCadastro(req, dados, erros));
return;
```

Isso mostra a pagina de novo com os erros e com os dados ja preenchidos.

Se nao tiver erro, cria o usuario:

```js
const usuario = {
  id: crypto.randomUUID(),
  nome: dados.nome,
  email: dados.email,
  ...
  tipo: "cliente"
};
```

Depois salva:

```js
usuarios.push(usuario);
await salvarUsuarios(usuarios);
```

Depois ja deixa o usuario logado:

```js
req.session.dadosLogin = {
  id: usuario.id,
  nome: usuario.nome,
  email: usuario.email,
  tipo: usuario.tipo,
  logado: true
};
```

Por fim:

```js
res.redirect("/index.html");
```

---

## 19. Logout

```js
server.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});
```

Isso apaga a sessao do usuario.

Depois manda para `/login`.

Na pratica, ele sai da conta e perde os dados da sessao.

---

## 20. Carrinho

O carrinho e guardado em:

```js
req.session.carrinho
```

Ou seja, cada visitante tem seu proprio carrinho.

### Adicionar ao carrinho

```js
server.post("/carrinho/adicionar", (req, res) => {
  const produto = produtos.find((p) => p.id === req.body.id);
  if (!produto) return res.redirect("/index.html");

  const carrinho = carrinhoDaSessao(req);
  const item = carrinho.find((i) => i.id === produto.id);
  if (item) item.quantidade += 1;
  else carrinho.push({ id: produto.id, quantidade: 1 });

  res.redirect(req.body.acao === "comprar" ? "/carrinho" : "/index.html");
});
```

Passo a passo:

1. Pega o `id` do produto vindo do formulario.
2. Procura o produto na lista.
3. Se nao encontrar, volta para a loja.
4. Pega o carrinho da sessao.
5. Se o produto ja existe no carrinho, aumenta a quantidade.
6. Se nao existe, adiciona com quantidade 1.
7. Se o botao foi `Comprar`, vai para o carrinho.
8. Se o botao foi adicionar, volta para a loja.

### Mostrar carrinho

```js
server.get("/carrinho", (req, res) => {
  res.send(renderCarrinho(req));
});
```

### Alterar quantidade

```js
server.post("/carrinho/alterar", (req, res) => {
  const item = carrinhoDaSessao(req).find((i) => i.id === req.body.id);
  if (item) item.quantidade = Math.max(1, item.quantidade + Number(req.body.delta || 0));
  res.redirect("/carrinho");
});
```

`delta` significa a mudanca:

- `1`: aumentar.
- `-1`: diminuir.

`Math.max(1, ...)` impede que a quantidade fique menor que 1.

### Remover produto

```js
server.post("/carrinho/remover", (req, res) => {
  req.session.carrinho = carrinhoDaSessao(req).filter((item) => item.id !== req.body.id);
  res.redirect("/carrinho");
});
```

Ele cria um novo carrinho sem o item removido.

### Limpar carrinho

```js
server.post("/carrinho/limpar", (req, res) => {
  req.session.carrinho = [];
  res.redirect("/carrinho");
});
```

Troca o carrinho por uma lista vazia.

---

## 21. Checkout e finalizar compra

### Protecao da rota

```js
server.get("/finalizar", verificarUsuarioLogado, (req, res) => {
  res.send(renderFinalizar(req));
});
```

Antes de mostrar a tela, roda:

```js
verificarUsuarioLogado
```

Se o usuario nao estiver logado, vai para:

```text
/login?aviso=login
```

### Atualizar entrega, pagamento e cupom

```js
server.post("/finalizar/atualizar", verificarUsuarioLogado, (req, res) => {
  req.session.checkout = {
    entrega: entregas[req.body.entrega] ? req.body.entrega : "expressa",
    pagamento: pagamentos[req.body.pagamento] ? req.body.pagamento : "pix",
    cupom: req.body.removerCupom ? "" : String(req.body.cupom || "").trim().toUpperCase()
  };
  res.redirect("/finalizar");
});
```

Isso salva no checkout da sessao:

- entrega escolhida;
- pagamento escolhido;
- cupom digitado.

Se o valor enviado nao existir, usa padrao:

- entrega: `expressa`;
- pagamento: `pix`.

### Confirmar pedido

```js
server.post("/finalizar/confirmar", verificarUsuarioLogado, (req, res) => {
  const totais = calcularTotais(req);
  const numeroPedido = "NTV-" + Math.floor(10000 + Math.random() * 90000);
  req.session.carrinho = [];
  req.session.checkout = { entrega: "expressa", pagamento: "pix", cupom: "" };
  res.send(renderPedidoConfirmado(req, totais, numeroPedido));
});
```

Passo a passo:

1. Calcula os totais.
2. Gera um numero de pedido aleatorio.
3. Limpa o carrinho.
4. Reseta o checkout.
5. Mostra a tela de pedido confirmado.

Importante: o pedido nao e salvo em banco.
Ele apenas mostra a confirmacao.

---

## 22. Area do funcionario

### Painel

```js
server.get("/funcionario", verificarFuncionario, (req, res) => {
  res.send(renderFuncionario(req));
});
```

Essa rota so abre se:

```js
req.session.dadosLogin?.logado && req.session.dadosLogin.tipo === "funcionario"
```

### Tela de cadastro de produto

```js
server.get("/cadastroProduto", verificarFuncionario, (req, res) => {
  res.send(renderCadastroProduto(req));
});
```

### Receber produto novo

```js
server.post("/cadastroProduto", verificarFuncionario, receberImagemProduto, (req, res) => {
  const nome = String(req.body.nome || "").trim();
  const categoria = String(req.body.categoria || "").trim();
  const unidade = String(req.body.unidade || "unidade").trim();
  const imagemDigitada = String(req.body.imagem || "").trim();
  const imagem = req.file ? `uploads/${req.file.filename}` : imagemDigitada || "Design_sem_nome.png";
  const preco = parsePrecoCentavos(req.body.preco);
  ...
});
```

Passo a passo:

1. Confere se e funcionario.
2. Recebe a imagem com `multer`.
3. Pega nome, categoria, unidade, imagem e preco.
4. Se foi enviado arquivo, usa o arquivo.
5. Se nao foi enviado arquivo, usa o nome digitado no campo imagem.
6. Se nada foi informado, usa `Design_sem_nome.png`.
7. Converte o preco.
8. Valida se nome, categoria e preco existem.
9. Adiciona o produto no array.
10. Redireciona para a lista.

### Remover produto

```js
server.post("/produto/remover", verificarFuncionario, (req, res) => {
  removerProduto(String(req.body.id || ""));
  res.redirect("/listaProdutos");
});
```

Remove o produto da lista em memoria.

### Listar produtos

```js
server.get("/listaProdutos", verificarFuncionario, (req, res) => {
  res.send(renderListaProdutos(req));
});
```

Mostra uma tabela com os produtos.

---

## 23. Como o servidor inicia

No final do `index.js`:

```js
await carregarUsuarios();
server.listen(porta, host, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
```

Primeiro:

```js
await carregarUsuarios();
```

Isso garante que:

- a pasta `data` exista;
- o arquivo `users.json` seja lido ou criado;
- o funcionario inicial exista.

Depois:

```js
server.listen(...)
```

Inicia o servidor Express.

---

## 24. `sessao.js`

Esse arquivo concentra regras que dependem da sessao.

### `usuarioLogado`

```js
export function usuarioLogado(req) {
  return req.session.dadosLogin;
}
```

Retorna os dados do usuario logado.

Usado no layout para saber se mostra:

- botao Entrar/Cadastrar;
- ou Ola, nome + Sair.

### `verificarUsuarioLogado`

```js
export function verificarUsuarioLogado(req, res, next) {
  if (req.session.dadosLogin?.logado) next();
  else res.redirect("/login?aviso=login");
}
```

Protege rotas que exigem login.

Se estiver logado, chama `next()`.
Se nao estiver, redireciona para o login.

### `verificarFuncionario`

```js
export function verificarFuncionario(req, res, next) {
  if (req.session.dadosLogin?.logado && req.session.dadosLogin.tipo === "funcionario") next();
  else res.redirect("/login?aviso=funcionario");
}
```

Protege rotas de funcionario.

Precisa:

- estar logado;
- ter tipo `funcionario`.

### `carrinhoDaSessao`

```js
export function carrinhoDaSessao(req) {
  if (!req.session.carrinho) req.session.carrinho = [];
  return req.session.carrinho;
}
```

Se o carrinho nao existir, cria um array vazio.
Depois retorna o carrinho.

Isso evita erro quando um usuario acessa o carrinho pela primeira vez.

### `itensCarrinho`

```js
export function itensCarrinho(req) {
  return carrinhoDaSessao(req)
    .map((item) => {
      const produto = produtos.find((p) => p.id === item.id);
      return produto ? { ...produto, quantidade: item.quantidade } : null;
    })
    .filter(Boolean);
}
```

O carrinho guarda apenas:

```js
{ id: "banana-prata", quantidade: 2 }
```

Mas para mostrar na tela precisa de:

- nome;
- preco;
- imagem;
- unidade;
- quantidade.

Entao `itensCarrinho` junta os dados do carrinho com os dados do produto.

### `checkoutDaSessao`

```js
export function checkoutDaSessao(req) {
  if (!req.session.checkout) {
    req.session.checkout = { entrega: "expressa", pagamento: "pix", cupom: "" };
  }
  return req.session.checkout;
}
```

Se o checkout nao existir, cria valores padrao.

### `calcularTotais`

```js
export function calcularTotais(req) {
  const checkout = checkoutDaSessao(req);
  const entrega = entregas[checkout.entrega] || entregas.expressa;
  const itens = itensCarrinho(req);
  const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const descontoPix = checkout.pagamento === "pix" ? subtotal * 0.05 : 0;
  const codigoCupom = String(checkout.cupom || "").toUpperCase();
  const descontoCupom = cupons[codigoCupom] ? subtotal * cupons[codigoCupom] : 0;
  const total = Math.max(0, subtotal + entrega.valor - descontoPix - descontoCupom);
  ...
}
```

Essa funcao calcula:

- itens do carrinho;
- subtotal;
- frete;
- pagamento;
- desconto Pix;
- desconto de cupom;
- total final.

Exemplo:

```text
Subtotal: R$ 100,00
Frete: R$ 8,90
PIX: -R$ 5,00
Cupom NATIVUS10: -R$ 10,00
Total: R$ 93,90
```

---

## 25. `dados/produtos.js`

Esse arquivo guarda os dados iniciais do catalogo.

```js
export let produtos = [
  ["tomate-organico", "Tomate Organico", 6, "kg", "legumes-Tomate-Andrea-1586283695804.png", "Legumes"],
  ...
].map(([id, nome, preco, unidade, imagem, categoria]) => ({ id, nome, preco, unidade, imagem, categoria }));
```

Primeiro os produtos sao escritos como arrays pequenos.
Depois `.map(...)` transforma cada array em objeto.

Exemplo:

```js
["banana-prata", "Banana Prata Organica", 5, "kg", "banana_prata.jpg", "Frutas"]
```

vira:

```js
{
  id: "banana-prata",
  nome: "Banana Prata Organica",
  preco: 5,
  unidade: "kg",
  imagem: "banana_prata.jpg",
  categoria: "Frutas"
}
```

Tambem existem:

```js
export const entregas = { ... };
export const pagamentos = { ... };
export const cupons = { ... };
```

### Entregas

```js
expressa: { nome: "Entrega Expressa", detalhe: "Receba hoje em ate 2h", valor: 8.9 }
```

Cada entrega tem:

- nome;
- detalhe;
- valor do frete.

### Pagamentos

```js
pix: { nome: "PIX", detalhe: "5% de desconto automatico" }
```

Cada pagamento tem:

- nome;
- detalhe.

### Cupons

```js
NATIVUS10: 0.1
```

Isso significa 10%.

```js
VERDE5: 0.05
```

Isso significa 5%.

### `adicionarProduto`

```js
export function adicionarProduto(produto) {
  produtos.push(produto);
}
```

Adiciona produto no array.

### `removerProduto`

```js
export function removerProduto(id) {
  produtos = produtos.filter((produto) => produto.id !== id);
}
```

Cria uma nova lista sem o produto removido.

Importante: produtos cadastrados ficam apenas em memoria.
Se reiniciar o servidor, volta para a lista inicial do arquivo.

---

## 26. `dados/usuarios.js`

Esse arquivo salva usuarios em JSON.

Ele usa:

```js
import fs from "fs/promises";
```

Essa e a versao com Promises do `fs`.

Por isso pode usar:

```js
await fs.readFile(...)
await fs.writeFile(...)
```

### Caminhos

```js
const DATA_DIR = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
```

`DATA_DIR` aponta para a pasta `data`.
`USERS_FILE` aponta para `data/users.json`.

### `salvarUsuarios`

```js
export async function salvarUsuarios(usuarios) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(usuarios, null, 2), "utf8");
}
```

Passo a passo:

1. Garante que a pasta `data` exista.
2. Transforma a lista de usuarios em texto JSON.
3. Salva no arquivo `users.json`.

`JSON.stringify(usuarios, null, 2)` gera JSON formatado com espacos.

### `carregarUsuarios`

```js
export async function carregarUsuarios() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  let usuarios = [];

  try {
    usuarios = JSON.parse(await fs.readFile(USERS_FILE, "utf8"));
  } catch {
    usuarios = [];
  }
  ...
}
```

Passo a passo:

1. Garante que a pasta `data` exista.
2. Tenta ler `users.json`.
3. Se conseguir, transforma o texto JSON em array.
4. Se der erro, usa array vazio.

O `catch` pode acontecer se:

- arquivo nao existe;
- arquivo esta vazio;
- JSON esta invalido.

Depois ele normaliza os usuarios:

```js
usuarios = usuarios
  .map((usuario) => ({
    ...usuario,
    id: usuario.id || crypto.randomUUID(),
    nome: usuario.nome || usuario.name || "Usuario",
    tipo: usuario.tipo || usuario.role || "cliente",
    senha: usuario.senha || usuario.password || ...
  }))
  .filter((usuario) => usuario.email && usuario.senha);
```

Isso corrige dados antigos ou incompletos.

Depois cria funcionario inicial se ele nao existir:

```js
if (!usuarios.some((u) => u.email === "funcionario@nativus.com.br")) {
  usuarios.push({
    id: crypto.randomUUID(),
    nome: "Funcionario Nativus",
    email: "funcionario@nativus.com.br",
    senha: "Nativus@123",
    tipo: "funcionario"
  });
}
```

Por fim salva e retorna:

```js
await salvarUsuarios(usuarios);
return usuarios;
```

---

## 27. `utils/formatacao.js`

Esse arquivo tem funcoes pequenas usadas em varios lugares.

### `escapar`

```js
export function escapar(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}
```

Serve para evitar que texto do usuario vire HTML perigoso.

Exemplo:

Se alguem digitar:

```html
<script>alert("oi")</script>
```

`escapar` transforma em texto seguro.

Por que isso importa?

Porque muitas telas montam HTML com template string:

```js
`<h2>${escapar(produto.nome)}</h2>`
```

Sem escapar, um texto malicioso poderia virar codigo HTML/JS.

### `dinheiro`

```js
export function dinheiro(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
```

Transforma numero em dinheiro brasileiro.

Exemplo:

```js
dinheiro(8.9)
```

Resultado:

```text
R$ 8,90
```

### `somenteDigitos`

```js
export function somenteDigitos(valor = "") {
  return String(valor).replace(/\D/g, "");
}
```

Remove tudo que nao for numero.

Exemplo:

```js
somenteDigitos("(11) 99999-8888")
```

Resultado:

```text
11999998888
```

### `parsePrecoCentavos`

```js
export function parsePrecoCentavos(valor) {
  const digitos = somenteDigitos(valor);
  if (!digitos) return 0;
  return Number(digitos) / 100;
}
```

Converte preco digitado para numero.

Exemplo:

```text
"12,30" -> "1230" -> 12.30
```

### `criarId`

```js
export function criarId(texto) {
  return texto.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now();
}
```

Cria um id baseado no nome.

Exemplo:

```text
"Mamao Papaya Organico" -> "mamao-papaya-organico-1779291937411"
```

Esse id e usado para produtos cadastrados.

### `hojeISO`

```js
export function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}
```

Retorna a data de hoje no formato:

```text
2026-05-21
```

Esse formato e usado em inputs de data.

---

## 28. `utils/validacoes.js`

Esse arquivo valida dados do cadastro.

### `validarCPF`

```js
export function validarCPF(cpf) {
  cpf = somenteDigitos(cpf);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  ...
}
```

Primeiro ele deixa so numeros.

Depois rejeita:

- CPF com tamanho diferente de 11;
- CPF com todos os numeros iguais, como `11111111111`.

Depois calcula os digitos verificadores do CPF.

Nao precisa decorar tudo agora, mas precisa entender a ideia:

> CPF tem uma regra matematica. O codigo recalcula os digitos finais e compara com os digitos digitados.

Se bater, CPF e valido.
Se nao bater, CPF e invalido.

### `validarCadastro`

```js
export function validarCadastro(dados, usuarios) {
  const erros = {};
  ...
  return erros;
}
```

Essa funcao recebe:

- `dados`: informacoes enviadas pelo formulario;
- `usuarios`: usuarios ja cadastrados.

Ela devolve um objeto de erros.

Exemplo:

```js
{
  email: "Informe um e-mail valido.",
  senha: "A senha deve ter pelo menos 6 caracteres."
}
```

Se o objeto vier vazio, nao tem erro.

Validacoes feitas:

- nome com pelo menos 3 caracteres;
- e-mail em formato valido;
- e-mail nao pode repetir;
- CPF valido;
- nascimento preenchido;
- nascimento nao pode ser maior que hoje;
- telefone com DDD;
- CEP com 8 numeros;
- endereco preenchido;
- numero preenchido;
- senha com pelo menos 6 caracteres;
- confirmacao de senha igual a senha.

---

## 29. Como as paginas HTML sao montadas

Os arquivos dentro de `paginas/` retornam strings HTML.

Exemplo simplificado:

```js
export function renderLogin(req, erro = "") {
  return layout(req, "Login", `
    <main>
      <h1>Entrar</h1>
    </main>
  `);
}
```

Isso significa:

1. A funcao cria o conteudo especifico da pagina.
2. Depois chama `layout(...)`.
3. O `layout` coloca navbar, `<html>`, `<head>`, Bootstrap e footer.

---

## 30. `paginas/layout.js`

Esse arquivo tem a base visual do site.

### `alerta`

```js
export function alerta(tipo, texto) {
  return texto ? `<div class="alert alert-${tipo} py-2">${escapar(texto)}</div>` : "";
}
```

Se existir texto, cria um alerta Bootstrap.
Se nao existir texto, retorna vazio.

Exemplo:

```js
alerta("danger", "E-mail invalido")
```

Vira:

```html
<div class="alert alert-danger py-2">E-mail invalido</div>
```

### `navbar`

```js
export function navbar(req) {
  const usuario = usuarioLogado(req);
  const qtd = carrinhoDaSessao(req).reduce((total, item) => total + item.quantidade, 0);
  ...
}
```

Ela monta o menu superior.

Mostra:

- logo;
- link da loja;
- link do carrinho com quantidade;
- links de funcionario, se o usuario for funcionario;
- botao Entrar/Cadastrar se nao estiver logado;
- nome e Sair se estiver logado.

### `layout`

```js
export function layout(req, titulo, conteudo) {
  return `<!doctype html>
  ...
  ${navbar(req)}
  ${conteudo}
  ...
  `;
}
```

Esse e o molde de todas as paginas.

Ele inclui:

- `<!doctype html>`;
- `<html lang="pt-br">`;
- `<meta charset="utf-8">`;
- Bootstrap CSS;
- Bootstrap Icons;
- navbar;
- conteudo da pagina;
- rodape com ultimo acesso;
- Bootstrap JS.

---

## 31. `paginas/loja.js`

Essa e a tela principal da loja.

```js
const busca = String(req.query.busca || "").trim().toLowerCase();
const lista = produtos.filter((produto) => produto.nome.toLowerCase().includes(busca));
```

`req.query.busca` pega o valor enviado pela URL.

Exemplo:

```text
/index.html?busca=banana
```

Entao:

```js
req.query.busca
```

vale:

```text
banana
```

Depois filtra os produtos cujo nome contem a busca.

Para cada produto, cria um card:

```js
const cards = lista.map((produto) => `...`).join("");
```

`map` transforma cada produto em HTML.
`join("")` junta todos os HTMLs em uma string so.

Cada card tem um formulario:

```html
<form method="POST" action="/carrinho/adicionar">
```

Esse formulario manda o produto para o carrinho.

---

## 32. `paginas/login.js`

Monta a tela de login.

Mostra aviso quando a URL tem:

```text
/login?aviso=login
/login?aviso=funcionario
```

O formulario envia:

```html
<form method="POST" action="/login">
```

Campos enviados:

- `tipo`;
- `email`;
- `senha`.

---

## 33. `paginas/cadastro.js`

Monta a tela de cadastro.

Tem duas partes:

1. HTML do formulario.
2. JavaScript no navegador para mascaras e busca de CEP.

### Campos com erro

```js
function campoClass(erros, nome) {
  return erros[nome] ? "form-control is-invalid" : "form-control";
}
```

Se um campo tem erro, recebe classe Bootstrap `is-invalid`.

### Mensagem do erro

```js
function erroCampo(erros, nome) {
  return erros[nome] ? `<div class="invalid-feedback">${escapar(erros[nome])}</div>` : "";
}
```

Se tem erro, mostra uma mensagem embaixo do campo.

### JavaScript do formulario

O script no final faz:

- mascara de telefone;
- mascara de CPF;
- validacao de CPF no navegador;
- mascara de CEP;
- busca endereco no ViaCEP;
- impede numero com letras;
- impede nascimento no futuro.

Mesmo com validacao no navegador, o servidor tambem valida.

Isso e importante porque validacao no navegador pode ser burlada.

---

## 34. `paginas/carrinho.js`

Monta a tela do carrinho.

```js
const itens = itensCarrinho(req);
const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
```

Calcula o subtotal.

Para cada item, mostra:

- imagem;
- nome;
- preco unitario;
- quantidade;
- botao de diminuir;
- botao de aumentar;
- total do item;
- botao de remover.

Os botoes de aumentar/diminuir enviam formulario `POST` para:

```text
/carrinho/alterar
```

O botao de remover envia para:

```text
/carrinho/remover
```

---

## 35. `paginas/finalizar.js`

Monta a tela de checkout.

Primeiro calcula totais:

```js
const totais = calcularTotais(req);
```

Se o carrinho estiver vazio, mostra aviso e botao para voltar.

Se tiver itens, mostra:

- entrega;
- pagamento;
- cupom;
- itens do pedido;
- resumo;
- total;
- botao confirmar pedido.

Quando o usuario muda entrega ou pagamento, um script envia o formulario automaticamente:

```js
document.querySelectorAll("#formCheckout .auto-submit").forEach((campo) => {
  campo.addEventListener("change", () => document.getElementById("formCheckout").submit());
});
```

Ou seja:

> mudou o select, atualiza o checkout.

---

## 36. `paginas/funcionario.js`

Esse arquivo monta tres telas:

1. Painel do funcionario.
2. Cadastro de produto.
3. Lista de produtos.

### Painel

Mostra dois cards:

- Cadastrar produto.
- Listar produtos.

### Cadastro de produto

Formulario envia:

```html
<form method="POST" action="/cadastroProduto" enctype="multipart/form-data">
```

`enctype="multipart/form-data"` e obrigatorio para upload de arquivo.

Campos:

- nome;
- categoria;
- preco;
- unidade;
- imagem existente;
- envio de arquivo.

O JavaScript do preco transforma digitos em formato monetario.

Exemplo:

```text
1230 -> 12,30
```

### Lista de produtos

Mostra tabela com:

- nome;
- categoria;
- preco;
- unidade;
- imagem;
- botao apagar.

O botao apagar usa:

```html
onsubmit="return confirm('Apagar este produto?');"
```

Assim o navegador pergunta antes de enviar o formulario.

---

## 37. Rotas completas

| Metodo | Rota | Protecao | O que faz |
| --- | --- | --- | --- |
| `GET` | `/` | Livre | Mostra loja. |
| `GET` | `/index` | Livre | Mostra loja. |
| `GET` | `/index.html` | Livre | Mostra loja. |
| `GET` | `/cliente` | Livre | Redireciona para `/index.html`. |
| `GET` | `/cliente.html` | Livre | Redireciona para `/index.html`. |
| `GET` | `/login` | Livre | Mostra login. |
| `POST` | `/login` | Livre | Valida login e cria sessao. |
| `GET` | `/cadastro` | Livre | Mostra cadastro. |
| `POST` | `/cadastro` | Livre | Valida, salva usuario e loga. |
| `GET` | `/logout` | Logado ou nao | Destroi sessao e volta ao login. |
| `POST` | `/carrinho/adicionar` | Livre | Adiciona produto ao carrinho. |
| `GET` | `/carrinho` | Livre | Mostra carrinho. |
| `POST` | `/carrinho/alterar` | Livre | Aumenta ou diminui quantidade. |
| `POST` | `/carrinho/remover` | Livre | Remove item do carrinho. |
| `POST` | `/carrinho/limpar` | Livre | Esvazia carrinho. |
| `GET` | `/finalizar` | Usuario logado | Mostra checkout. |
| `POST` | `/finalizar/atualizar` | Usuario logado | Atualiza entrega, pagamento e cupom. |
| `POST` | `/finalizar/confirmar` | Usuario logado | Confirma pedido e limpa carrinho. |
| `GET` | `/funcionario` | Funcionario | Mostra painel. |
| `GET` | `/cadastroProduto` | Funcionario | Mostra formulario de produto. |
| `POST` | `/cadastroProduto` | Funcionario | Recebe dados, imagem e cadastra produto. |
| `POST` | `/produto/remover` | Funcionario | Remove produto. |
| `GET` | `/listaProdutos` | Funcionario | Lista produtos. |

---

## 38. Fluxo completo de uma compra

```text
Usuario abre /index.html
  ve produtos
  clica Comprar

POST /carrinho/adicionar
  adiciona produto na sessao
  redireciona para /carrinho

GET /carrinho
  mostra itens e subtotal
  usuario clica Finalizar compra

GET /finalizar
  se nao estiver logado, manda para /login
  se estiver logado, mostra checkout

POST /finalizar/atualizar
  salva entrega, pagamento e cupom na sessao

POST /finalizar/confirmar
  calcula total
  gera numero do pedido
  limpa carrinho
  mostra pedido confirmado
```

---

## 39. Fluxo completo de cadastro e login

```text
Usuario abre /cadastro
  preenche dados
  navegador aplica mascaras
  navegador busca CEP no ViaCEP

POST /cadastro
  servidor monta objeto dados
  servidor carrega usuarios
  servidor valida campos
  se tiver erro, mostra formulario novamente
  se estiver certo, salva em data/users.json
  cria sessao de login
  redireciona para loja

GET /logout
  destroi sessao

GET /login
  mostra formulario

POST /login
  carrega usuarios
  compara email/senha/tipo
  cria sessao
  redireciona conforme tipo
```

---

## 40. Fluxo completo do funcionario

```text
Funcionario abre /login
  escolhe tipo Funcionario
  entra com email e senha

POST /login
  verifica se usuario existe
  verifica senha
  verifica se tipo e funcionario
  salva sessao
  redireciona para /funcionario

GET /funcionario
  mostra painel

GET /cadastroProduto
  mostra formulario

POST /cadastroProduto
  verifica funcionario
  recebe imagem com multer
  valida campos
  adiciona produto em memoria
  redireciona para /listaProdutos

GET /listaProdutos
  mostra tabela

POST /produto/remover
  remove produto em memoria
```

---

## 41. O que fica salvo e onde

### Usuarios

Usuarios sao salvos em:

```text
data/users.json
```

Esse arquivo esta no `.gitignore`, entao normalmente nao vai para o Git.

### Carrinho

Carrinho fica na sessao:

```js
req.session.carrinho
```

Se a sessao expirar ou for destruida, o carrinho some.

### Checkout

Checkout tambem fica na sessao:

```js
req.session.checkout
```

### Produtos

Produtos iniciais ficam em:

```text
dados/produtos.js
```

Produtos cadastrados pelo funcionario ficam apenas em memoria.

Isso significa:

```text
Reiniciou o servidor -> produtos cadastrados pelo funcionario somem
```

### Imagens enviadas

Imagens enviadas ficam em:

```text
public/imagens/uploads
```

---

## 42. Pontos importantes para entender Express

### `server.get`

Usado quando o navegador quer buscar/abrir uma pagina.

Exemplo:

```js
server.get("/login", (req, res) => {
  res.send(renderLogin(req));
});
```

### `server.post`

Usado quando formulario envia dados.

Exemplo:

```js
server.post("/login", (req, res) => {
  ...
});
```

### `req`

Representa a requisicao.

Pode conter:

- `req.body`: dados de formulario.
- `req.query`: dados da URL.
- `req.params`: parametros de rota.
- `req.cookies`: cookies.
- `req.session`: sessao.
- `req.file`: arquivo enviado pelo multer.

### `res`

Representa a resposta.

Usado para:

```js
res.send(...)
res.redirect(...)
res.status(...)
res.cookie(...)
```

### `next`

Usado em middlewares.

Significa:

> Terminei minha parte, pode continuar para a proxima funcao.

---

## 43. Por que separar em varios arquivos?

Seria possivel colocar tudo em `index.js`, mas ficaria grande e dificil de entender.

Separar ajuda porque cada arquivo tem uma responsabilidade:

- `index.js`: rotas e configuracao do servidor.
- `sessao.js`: regras ligadas a sessao.
- `dados/produtos.js`: dados dos produtos.
- `dados/usuarios.js`: persistencia dos usuarios.
- `utils/`: funcoes reaproveitaveis.
- `paginas/`: HTML das telas.

Isso facilita:

- encontrar codigo;
- estudar por partes;
- evitar repeticao;
- corrigir bugs;
- explicar o projeto para outras pessoas.

---

## 44. Pontos de seguranca e melhorias futuras

Como projeto de estudo, esta bom para aprender.
Mas para producao, precisaria melhorar algumas coisas.

### Senhas

Hoje as senhas ficam salvas em texto puro no `users.json`.

Em projeto real, senha deve ser salva com hash, por exemplo usando `bcrypt`.

### Banco de dados

Usuarios ficam em JSON e produtos cadastrados ficam em memoria.

Em projeto real, usaria banco como:

- SQLite;
- PostgreSQL;
- MySQL;
- MongoDB.

### Produtos cadastrados

Hoje produtos novos somem quando o servidor reinicia.

Melhoria:

- salvar produtos em JSON;
- ou salvar em banco de dados.

### Pedidos

Hoje o pedido confirmado nao fica salvo.

Melhoria:

- criar uma tabela/arquivo de pedidos;
- salvar usuario, itens, total e data.

### Upload

Hoje a imagem vai para `public/imagens/uploads`.

Em deploy serverless, como Vercel, isso pode nao ser permanente.

Melhoria:

- salvar imagens em servico proprio, como S3, Cloudinary ou Vercel Blob.

### Sessao

Hoje `express-session` usa armazenamento em memoria por padrao.

Em producao, o ideal e usar um armazenamento persistente, como Redis ou banco.

---

## 45. Revisao rapida dos imports que mais confundem

```js
import fs from "fs";
```

Serve para mexer com arquivos e pastas.
No projeto cria a pasta de uploads e apaga imagem quando o produto da erro.

```js
import multer from "multer";
```

Serve para receber upload de arquivo.
No projeto recebe imagem do produto.

```js
import path from "path";
```

Serve para montar caminhos de arquivos corretamente.
No projeto monta caminhos como `public/imagens/uploads`.

```js
import { fileURLToPath } from "url";
```

Serve para transformar `import.meta.url` em caminho real do computador.
No projeto ajuda a criar o `__dirname`.

```js
import session from "express-session";
```

Serve para guardar dados temporarios por visitante.
No projeto guarda login, carrinho e checkout.

```js
import cookieParser from "cookie-parser";
```

Serve para ler cookies.
No projeto le o cookie de ultimo acesso.

```js
import crypto from "crypto";
```

Serve para gerar ids unicos.
No projeto gera id de usuario.

---

## 46. Ordem recomendada para estudar o codigo

Para entender 100%, leia nessa ordem:

1. `package.json`
   - Veja scripts e dependencias.

2. `index.js`
   - Entenda imports, middlewares e rotas.

3. `paginas/layout.js`
   - Entenda como todas as paginas ganham navbar, Bootstrap e rodape.

4. `dados/produtos.js`
   - Entenda o catalogo, entregas, pagamentos e cupons.

5. `sessao.js`
   - Entenda login, funcionario, carrinho e calculo de totais.

6. `paginas/loja.js`
   - Entenda a listagem de produtos e o formulario do carrinho.

7. `paginas/carrinho.js`
   - Entenda alteracao de quantidade e subtotal.

8. `paginas/finalizar.js`
   - Entenda checkout, descontos e pedido confirmado.

9. `paginas/login.js`
   - Entenda formulario de login.

10. `paginas/cadastro.js`
    - Entenda formulario, mascaras, ViaCEP e erros.

11. `dados/usuarios.js`
    - Entenda como usuarios sao carregados/salvos.

12. `utils/formatacao.js`
    - Entenda funcoes auxiliares.

13. `utils/validacoes.js`
    - Entenda regras de validacao.

14. `paginas/funcionario.js`
    - Entenda cadastro/lista/remocao de produtos.

---

## 47. Resumo final

Este projeto e um exemplo completo de aplicacao Express renderizada no servidor.

Ele mostra como:

- criar servidor Node com Express;
- organizar rotas;
- receber formularios;
- usar cookies;
- usar sessoes;
- proteger rotas;
- montar HTML pelo servidor;
- separar codigo em modulos;
- salvar usuarios em JSON;
- fazer upload de imagem;
- calcular carrinho e checkout;
- criar area de cliente e funcionario.

Se voce entender bem o fluxo abaixo, entendeu a base do projeto:

```text
Formulario HTML
  envia dados para rota Express
Express
  le req.body / req.query / req.session / req.cookies
  valida dados
  altera memoria, arquivo JSON ou sessao
  chama uma funcao render
Funcao render
  monta HTML com Bootstrap
Servidor
  envia HTML para navegador
Navegador
  mostra a pagina
```

Essa e a base de muitos sistemas web tradicionais.
