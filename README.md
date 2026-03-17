# Projeto Final Web — Como Rodar

## Pré-requisitos

- [Node.js 18+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## 1. Instalar dependências

```bash
npm install
```

---

## 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
MONGODB_URI=mongodb://localhost:27017/finance_app
JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=email_do_admin@gmail.com
```

> Troque `email_do_admin@gmail.com` pelo email que será usado como administrador do sistema.


---

## 3. Rodar o projeto

```bash
npm run dev
```

Acesse no navegador: **http://localhost:3000**

---

## Primeiro acesso

1. Abre **http://localhost:3000/login**
2. Clique em **"Criar conta"**
3. Cadastre-se com o email definido em `ADMIN_EMAIL` para ter acesso de **administrador**
4. Qualquer outro email será cadastrado como **membro**

---

## Rotas principais

| Rota         | Descrição                          | Acesso        |
|--------------|------------------------------------|---------------|
| `/login`     | Tela de login e cadastro           | Público       |
| `/dashboard` | Dashboard financeiro com gráficos  | Todos         |
| `/admin`     | Painel de administração            | Somente admin |

---

## Problemas comuns

**CSS não aparece**
```bash
npm install
```
