# Finance App — Deploy (Docker Compose), Admin e .env

Este README foca em: **subir o projeto com Docker Compose**, **como logar com admin** e **como criar o `.env`**.

---

## 1. Pré-requisitos

- Docker + Docker Compose

---

## 2. Criar o `.env`

Crie um arquivo `.env` na raiz com:

```env
MONGODB_URI=mongodb://localhost:27017/finance_app
JWT_SECRET=uma_chave_forte_aqui
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@financeapp.com
ADMIN_PASSWORD=admin123
```

Notas:
- Quando usar **Docker Compose**, o `MONGODB_URI` do container já é definido no `docker-compose.yml` como `mongodb://mongo:27017/finance_app`.
- Para rodar sem Docker, use `MONGODB_URI=mongodb://localhost:27017/finance_app`.
- `JWT_SECRET` deve ser **uma string forte e única**.
- `ADMIN_EMAIL` define o e-mail do usuário administrador.
- `ADMIN_PASSWORD` é usado pelo `seed.js` se você decidir popular o banco.

---

## 3. Subir com Docker Compose (recomendado)

```bash
docker compose up --build
```

Acesse: **http://localhost:3000**

---

## 4. Criar o admin e logar

Você tem duas opções:

**Opção A — Criar pelo login**
1. Acesse `/login`
2. Clique em **Criar conta**
3. Cadastre com o e-mail igual ao `ADMIN_EMAIL` do `.env`
4. Esse usuário será **admin automaticamente**

**Opção B — Rodar seed (gera usuário admin + dados)**
```bash
node seed.js
```
O seed cria um usuário com:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Depois é só logar normalmente.

---

## 5. Produção com Docker

Você pode usar o mesmo `docker compose up --build` em servidor.  
Se preferir, adapte o `docker-compose.yml` e adicione um proxy (Nginx) para HTTPS/domínio.

---

## Rotas principais

| Rota         | Descrição                         | Acesso        |
|--------------|-----------------------------------|---------------|
| `/login`     | Login e cadastro                  | Público       |
| `/dashboard` | Visão financeira                  | Usuários      |
| `/admin`     | Painel administrativo             | Somente admin |

---

## Dica rápida

Se nada aparecer no dashboard, verifique:
1. O usuário está logado?
2. Existem dados no banco associados a esse usuário?
3. As variáveis do `.env` estão corretas?
