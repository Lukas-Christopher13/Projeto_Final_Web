# Finance App — Deploy, Admin e .env

Este README foca em: **como subir o projeto em produção**, **como logar com admin** e **como criar o `.env`**.

---

## 1. Pré-requisitos

- Node.js 18+
- MongoDB (local ou Atlas)

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
- `MONGODB_URI` pode apontar para MongoDB Atlas.
- `JWT_SECRET` deve ser **uma string forte e única**.
- `ADMIN_EMAIL` define o e-mail do usuário administrador.
- `ADMIN_PASSWORD` é usado pelo `seed.js` se você decidir popular o banco.

---

## 3. Rodar localmente (dev)

```bash
npm install
npm run dev
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

## 5. Subir em produção (build + start)

```bash
npm install
npm run build
npm run start
```

Garanta que as variáveis de ambiente estejam configuradas no servidor.

---

## 6. Deploy em serviços comuns

**Vercel**
1. Suba o repositório
2. Configure as variáveis do `.env` na plataforma
3. Deploy automático

**Servidor próprio (Ubuntu/Docker)**
1. Configure as variáveis
2. `npm install && npm run build && npm run start`
3. Use um proxy (Nginx) se quiser domínio/HTTPS

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
