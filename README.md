# PiNativus Node.js

Projeto em Node.js + Express seguindo o padrao da atividade de cookies/sessoes, com Bootstrap via CDN.

## Como rodar

```bash
cd "C:\Users\caiof\Documents\Pi_mercado\layout 3\PiNativus"
npm install
npm start
```

Depois abra:

```text
http://localhost:3000
```

## Login

Usuarios podem criar conta em `/cadastro` e depois entrar em `/login` com o mesmo e-mail e senha.

Funcionario inicial:

- E-mail: `funcionario@nativus.com.br`
- Senha: `Nativus@123`

## Rotas

- `/` index da loja
- `/cadastro` cadastro de usuario
- `/login` login
- `/carrinho` carrinho por sessao
- `/finalizar` checkout protegido por login
- `/funcionario` area protegida por middleware de funcionario
- `/cadastroProduto` cadastro de produto protegido
- `/listaProdutos` lista de produtos protegida

Os usuarios criados ficam em `data/users.json` no ambiente local.
