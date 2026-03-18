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
