# 💰 FinanceApp — Sistema de Gestão Financeira

Sistema web de gestão financeira pessoal com autenticação dupla (email/senha e Google), painel administrativo e dashboard com gráficos interativos.

**Stack:** Next.js 14 (frontend) · Node.js + Express (backend) · MongoDB Atlas  
**Padrão:** MVC · **Autenticação:** JWT + Google OAuth 2.0

---

## 📁 Estrutura do Projeto

```
financeapp/
├── backend/                        # API REST — Node.js + Express
│   ├── .env.example                # Variáveis de ambiente (modelo)
│   ├── package.json
│   └── src/
│       ├── server.js               # Entry point — sobe o servidor
│       ├── config/
│       │   └── database.js         # Conexão com MongoDB Atlas via Mongoose
│       ├── models/                 # M (MVC) — Schemas do banco
│       │   ├── User.js             # Usuário (roles, bcrypt, googleId)
│       │   └── Transaction.js      # Transações financeiras
│       ├── controllers/            # C (MVC) — Lógica de negócio
│       │   ├── authController.js   # Login, cadastro, Google OAuth
│       │   ├── adminController.js  # Gestão de membros
│       │   └── transactionController.js  # CRUD + resumo mensal
│       ├── routes/                 # V (MVC) — Definição das rotas HTTP
│       │   ├── authRoutes.js
│       │   ├── adminRoutes.js
│       │   └── transactionRoutes.js
│       └── middlewares/
│           └── auth.js             # Verificação JWT + autorização por role
└── frontend/                       # App Next.js 14 — App Router
    ├── .env.local.example
    ├── jsconfig.json               # Alias @/ para src/
    ├── package.json
    └── src/
        ├── app/
        │   ├── layout.jsx          # Providers globais (Google OAuth, Toast)
        │   ├── globals.css         # Design system (variáveis CSS, utilitários)
        │   ├── page.jsx            # Redirect automático por role
        │   ├── login/              # Tela de login + cadastro + Google
        │   ├── dashboard/          # Dashboard financeiro com gráficos
        │   └── admin/              # Painel de administração (restrito)
        ├── components/
        │   └── Navbar.jsx          # Navegação global com avatar e logout
        └── lib/
            ├── api.js              # Instância Axios com interceptors JWT
            └── AuthContext.jsx     # Estado global de autenticação
```

---

## 🛠️ Serviços externos utilizados

### 🍃 MongoDB Atlas

O projeto usa **MongoDB Atlas** como banco de dados em nuvem. O Atlas é a versão gerenciada do MongoDB — você não precisa instalar nada localmente, tudo fica hospedado nos servidores deles.

**Como foi configurado:**

1. Criamos um cluster gratuito no [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Criamos um usuário de banco com usuário e senha em **Database Access**
3. Liberamos acesso de qualquer IP em **Network Access** → `0.0.0.0/0`
4. Copiamos a **Connection String** gerada pelo Atlas no formato:
   ```
   mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/financeapp
   ```
5. Colamos essa string na variável `MONGODB_URI` do arquivo `backend/.env`

O Mongoose (biblioteca usada no backend) conecta automaticamente ao Atlas quando o servidor sobe, e cria as collections `users` e `transactions` na primeira execução.

> ⚠️ A senha do banco **não pode ter caracteres especiais** como `@`, `#`, `!` na connection string sem encoding. Use apenas letras e números para evitar erro de autenticação.

---

### 🔐 Google OAuth 2.0

O projeto usa o **Google OAuth 2.0** para permitir login com conta Google. Isso é feito através do **Google Cloud Console** — não é uma API paga, é gratuito para uso em desenvolvimento e em produção com volume normal.

O fluxo utilizado é o **Authorization Code + Popup**, onde o usuário clica no botão, um popup do Google abre para ele escolher a conta, e o Google retorna um `access_token` que o backend valida consultando a API de userinfo do Google:

```
Frontend (botão Google)
  → Popup do Google (usuário escolhe conta)
    → Google retorna access_token
      → Backend valida em googleapis.com/oauth2/v3/userinfo
        → Cria ou encontra usuário no banco
          → Retorna JWT próprio da aplicação
```

**Como foi configurado:**

1. Criamos um projeto no [console.cloud.google.com](https://console.cloud.google.com)
2. Em **APIs & Services → OAuth consent screen** configuramos a tela de consentimento como **External**
3. Em **APIs & Services → Credentials** criamos um **OAuth 2.0 Client ID** do tipo **Web application**
4. Adicionamos `http://localhost:3000` nas **Authorized JavaScript origins** e nos **Authorized redirect URIs**
5. Copiamos o **Client ID** e o **Client Secret** gerados

As credenciais ficam em:
- `backend/.env` → `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`
- `frontend/.env.local` → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

**Biblioteca usada no backend:** `google-auth-library` (pacote oficial do Google para Node.js)  
**Biblioteca usada no frontend:** `@react-oauth/google` (wrapper React para o SDK do Google)

**Regra de admin via Google:** se o email da conta Google for igual ao `ADMIN_EMAIL` definido no `.env` do backend, o usuário é criado automaticamente com role `admin` e redirecionado para o Painel de Administração.

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18 ou superior — [nodejs.org](https://nodejs.org)
- Conta no MongoDB Atlas — [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Conta no Google Cloud Console — [console.cloud.google.com](https://console.cloud.google.com)

---

### 1. Clonar e instalar

```bash
git clone <url-do-repositorio>

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

---

### 2. Configurar variáveis de ambiente

**Backend** — copie o exemplo e preencha:

```bash
cd backend
cp .env.example .env
```

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas — cole a connection string gerada no Atlas
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/financeapp

# JWT — coloque qualquer texto longo e aleatório
JWT_SECRET=sua_chave_secreta_longa_aqui
JWT_EXPIRES_IN=7d

# Google OAuth — do Google Cloud Console
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-seu_client_secret

# URL do frontend (para CORS)
FRONTEND_URL=http://localhost:3000

# Conta admin criada automaticamente no primeiro boot
ADMIN_NAME=Administrador
ADMIN_EMAIL=seuemail@gmail.com
ADMIN_PASSWORD=SuaSenhaForte123
```

**Frontend** — copie o exemplo e preencha:

```bash
cd frontend
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
```

---

### 3. Rodar (dois terminais)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

Saída esperada:
```
🚀 Servidor rodando na porta 5000
✅ MongoDB conectado: cluster0.xxxxx.mongodb.net
✅ Admin padrão criado!
   Email: seuemail@gmail.com
   Senha: SuaSenhaForte123
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🔑 Acesso admin

O email definido em `ADMIN_EMAIL` no `.env` é o único que acessa o **Painel de Administração**. Funciona tanto pelo login com email/senha quanto pelo login com Google — o sistema detecta o email automaticamente e atribui a role `admin`.

Todos os outros usuários (cadastro próprio ou Google) entram como `member` e acessam apenas o Dashboard financeiro.

---

## 📡 Endpoints da API

### Autenticação
| Método | Rota                  | Descrição                        | Auth |
|--------|-----------------------|----------------------------------|------|
| POST   | /api/auth/register    | Cadastro com email e senha       | ❌   |
| POST   | /api/auth/login       | Login com email e senha          | ❌   |
| POST   | /api/auth/google      | Login/cadastro com Google        | ❌   |
| GET    | /api/auth/me          | Dados do usuário logado          | ✅   |
| POST   | /api/auth/logout      | Logout                           | ✅   |

### Administração (somente admin)
| Método | Rota                          | Descrição                  | Auth  |
|--------|-------------------------------|----------------------------|-------|
| GET    | /api/admin/members            | Lista todos os membros     | Admin |
| POST   | /api/admin/members            | Adiciona membro manualmente| Admin |
| PATCH  | /api/admin/members/:id/toggle | Ativa ou desativa membro   | Admin |
| DELETE | /api/admin/members/:id        | Remove membro              | Admin |
| GET    | /api/admin/stats              | Estatísticas gerais        | Admin |

### Transações (usuário autenticado)
| Método | Rota                        | Descrição                        | Auth |
|--------|-----------------------------|----------------------------------|------|
| GET    | /api/transactions           | Lista transações (com filtros)   | ✅   |
| POST   | /api/transactions           | Cria nova transação              | ✅   |
| DELETE | /api/transactions/:id       | Remove transação                 | ✅   |
| GET    | /api/transactions/summary   | Resumo mensal + gráficos + top 5 | ✅   |

---

## 🏗️ Arquitetura MVC

| Camada     | Onde                        | Responsabilidade                        |
|------------|-----------------------------|-----------------------------------------|
| Model      | `backend/src/models/`       | Schema, validações, hash de senha       |
| Controller | `backend/src/controllers/`  | Lógica de negócio, queries, respostas   |
| View/Router| `backend/src/routes/`       | Mapeamento de rotas HTTP para controllers|
| Middleware | `backend/src/middlewares/`  | Verificação JWT, autorização por role   |

---

## 🔐 Segurança

- Senhas armazenadas com hash **bcrypt** (12 salt rounds)
- Autenticação via **JWT** com expiração configurável
- Login Google validado **server-side** via API oficial do Google
- Campos sensíveis nunca retornados nas respostas (`select: false` no Mongoose)
- Rotas protegidas por **role** — admin e member têm acessos distintos
- **CORS** restrito ao domínio do frontend
- Admin não pode ser deletado ou desativado pelo painel

---

## 📦 Principais dependências

### Backend
| Pacote | Uso |
|--------|-----|
| `express` | Framework HTTP |
| `mongoose` | ODM para MongoDB |
| `jsonwebtoken` | Geração e verificação de JWT |
| `bcryptjs` | Hash de senhas |
| `google-auth-library` | Verificação de tokens Google |
| `cors` | Liberação de CORS |
| `dotenv` | Carregamento de variáveis de ambiente |
| `nodemon` | Reload automático em desenvolvimento |

### Frontend
| Pacote | Uso |
|--------|-----|
| `next` | Framework React com App Router |
| `@react-oauth/google` | Botão e fluxo de login Google |
| `axios` | Cliente HTTP com interceptors |
| `recharts` | Gráficos de pizza e barras |
| `react-hot-toast` | Notificações |
