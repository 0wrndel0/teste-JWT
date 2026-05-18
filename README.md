# API Biblioteca com JWT

Projeto desenvolvido em Node.js, Express, MongoDB e Mongoose para praticar autenticação com JWT, rotas protegidas, usuários ativos, regras de negócio e organização profissional em camadas.

> Este projeto não inclui `package.json`, `package-lock.json` nem `node_modules`, conforme solicitado. Crie o seu `package.json` e instale as dependências necessárias.

## Dependências necessárias

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken nodemon
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGO_URI=sua_string_do_mongodb
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d
```

## Estrutura

```txt
api-biblioteca-jwt/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── bookController.js
│   ├── loanController.js
│   └── userController.js
├── middlewares/
│   ├── adminMiddleware.js
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── notFound.js
├── models/
│   ├── Book.js
│   ├── Loan.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── loanRoutes.js
│   └── userRoutes.js
├── services/
│   ├── adminService.js
│   ├── authService.js
│   ├── bookService.js
│   ├── loanService.js
│   └── userService.js
├── utils/
│   ├── AppError.js
│   └── calculateFine.js
├── .env.example
├── README.md
└── server.js
```

## Rotas principais

### Auth

| Método | Rota | Proteção | Função |
|---|---|---|---|
| POST | `/auth/register` | Pública | Registrar usuário |
| POST | `/auth/login` | Pública | Login e geração de token |

### Users

| Método | Rota | Proteção | Função |
|---|---|---|---|
| GET | `/users/me` | Usuário logado | Ver meu perfil |
| PUT | `/users/me` | Usuário logado | Atualizar meu perfil |
| GET | `/users` | Admin | Listar usuários |
| GET | `/users/:id` | Admin | Buscar usuário por id |
| PUT | `/users/:id` | Admin | Atualizar usuário |
| PATCH | `/users/:id/deactivate` | Admin | Desativar usuário |
| PATCH | `/users/:id/activate` | Admin | Ativar usuário |

### Books

| Método | Rota | Proteção | Função |
|---|---|---|---|
| POST | `/books` | Admin | Criar livro |
| GET | `/books` | Pública | Listar livros |
| GET | `/books/available` | Pública | Listar disponíveis |
| GET | `/books/search/:title` | Pública | Buscar por título |
| GET | `/books/category/:category` | Pública | Buscar por categoria |
| GET | `/books/:id` | Pública | Buscar por id |
| PUT | `/books/:id` | Admin | Atualizar livro |
| PATCH | `/books/:id/deactivate` | Admin | Desativar livro |
| PATCH | `/books/:id/activate` | Admin | Ativar livro |

### Loans

| Método | Rota | Proteção | Função |
|---|---|---|---|
| POST | `/loans` | Usuário logado | Criar empréstimo |
| GET | `/loans/my` | Usuário logado | Listar meus empréstimos |
| GET | `/loans` | Admin | Listar todos os empréstimos |
| GET | `/loans/user/:userId` | Admin | Listar empréstimos de um usuário |
| GET | `/loans/active` | Admin | Listar empréstimos ativos |
| GET | `/loans/overdue` | Admin | Listar empréstimos atrasados |
| GET | `/loans/:id` | Usuário logado | Buscar empréstimo por id |
| PATCH | `/loans/:id/return` | Usuário logado | Devolver livro |
| POST | `/loans/:id/fine/simulate` | Usuário logado | Simular multa |

### Admin

| Método | Rota | Proteção | Função |
|---|---|---|---|
| GET | `/admin/dashboard` | Admin | Dashboard geral |
| GET | `/admin/users/with-active-loans` | Admin | Usuários com empréstimos ativos |
| GET | `/admin/books/most-borrowed` | Admin | Livros mais emprestados |
| GET | `/admin/fines` | Admin | Listar multas |

## Como testar no Postman

### 1. Criar admin

```http
POST http://localhost:3000/auth/register
```

```json
{
  "nome": "Admin",
  "email": "admin@gmail.com",
  "password": "123456",
  "telefone": "44999999999",
  "role": "admin"
}
```

### 2. Login admin

```http
POST http://localhost:3000/auth/login
```

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

Copie o token retornado e use nas rotas protegidas:

```txt
Authorization: Bearer SEU_TOKEN_AQUI
```

### 3. Criar livro com token admin

```http
POST http://localhost:3000/books
```

```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "categoria": "Romance",
  "ano": 1899,
  "quantidadeTotal": 5
}
```

### 4. Criar usuário comum

```http
POST http://localhost:3000/auth/register
```

```json
{
  "nome": "Cliente",
  "email": "cliente@gmail.com",
  "password": "123456",
  "telefone": "44988888888"
}
```

### 5. Login usuário comum

```http
POST http://localhost:3000/auth/login
```

```json
{
  "email": "cliente@gmail.com",
  "password": "123456"
}
```

### 6. Criar empréstimo com token do usuário

Não envie `userId` no body. O sistema pega o usuário pelo token.

```http
POST http://localhost:3000/loans
```

```json
{
  "bookId": "ID_DO_LIVRO",
  "diasParaDevolucao": 7
}
```

### 7. Ver meus empréstimos

```http
GET http://localhost:3000/loans/my
```

### 8. Devolver livro

```http
PATCH http://localhost:3000/loans/ID_DO_EMPRESTIMO/return
```

### 9. Simular multa

```http
POST http://localhost:3000/loans/ID_DO_EMPRESTIMO/fine/simulate
```

## Regras de negócio implementadas

- Senha é criptografada com `bcryptjs`.
- Login gera token JWT.
- Usuário inativo não consegue fazer login.
- Usuário inativo não consegue acessar rotas protegidas.
- Admin é validado por `adminMiddleware`.
- `POST /loans` usa `req.user._id`, não recebe `userId` no body.
- Livro precisa estar ativo e disponível para ser emprestado.
- Usuário não pode pegar o mesmo livro duas vezes sem devolver.
- Ao emprestar, `quantidadeDisponivel` diminui em 1.
- Ao devolver, `quantidadeDisponivel` aumenta em 1.
- Devolução calcula multa por atraso.
- Usuário comum só acessa seus próprios empréstimos.
- Admin pode acessar relatórios e dados gerais.
- Não é possível desativar usuário com empréstimo ativo.
- Não é possível desativar livro com empréstimo ativo.
- Não é possível reduzir `quantidadeTotal` abaixo da quantidade já emprestada.

## Ordem sugerida para estudar o código

1. `server.js`
2. `routes/authRoutes.js`
3. `controllers/authController.js`
4. `services/authService.js`
5. `middlewares/authMiddleware.js`
6. `middlewares/adminMiddleware.js`
7. `routes/bookRoutes.js`
8. `services/bookService.js`
9. `routes/loanRoutes.js`
10. `services/loanService.js`
11. `routes/adminRoutes.js`
12. `services/adminService.js`
