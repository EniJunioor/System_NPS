# Documentação Completa do Backend - Sistema NPS

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Banco de Dados](#banco-de-dados)
6. [API Endpoints](#api-endpoints)
7. [Autenticação e Autorização](#autenticação-e-autorização)
8. [Sistema de Logs](#sistema-de-logs)
9. [Middleware](#middleware)
10. [Validação](#validação)
11. [Serviços](#serviços)
12. [Testes](#testes)
13. [Deploy](#deploy)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O backend do Sistema NPS é uma API RESTful construída com Node.js e Express, que fornece todas as funcionalidades necessárias para gerenciamento de tickets, tarefas, avaliações NPS e usuários.

### Tecnologias Principais

- **Node.js** 20+
- **Express** 4.x - Framework web
- **Prisma** 6.x - ORM para PostgreSQL
- **PostgreSQL** 16+ - Banco de dados
- **JWT** - Autenticação
- **Joi** - Validação de dados
- **Swagger** - Documentação da API
- **Jest** - Testes unitários

### Funcionalidades Principais

- ✅ Autenticação e autorização baseada em JWT
- ✅ CRUD completo de Tickets
- ✅ CRUD completo de Tarefas
- ✅ Sistema de Avaliação NPS
- ✅ Geração e validação de tokens de avaliação
- ✅ Dashboard com estatísticas
- ✅ Sistema de notificações
- ✅ Upload de arquivos
- ✅ **Sistema de logs completo** (novo)
- ✅ Documentação Swagger

---

## 🏗️ Arquitetura

O backend segue uma arquitetura em camadas:

```
┌─────────────────────────────────────┐
│         Routes (Rotas)              │  ← Define endpoints HTTP
├─────────────────────────────────────┤
│      Middleware (Interceptores)     │  ← Autenticação, Logs, Validação
├─────────────────────────────────────┤
│       Services (Serviços)           │  ← Lógica de negócio
├─────────────────────────────────────┤
│      Prisma (ORM)                   │  ← Acesso ao banco de dados
├─────────────────────────────────────┤
│      PostgreSQL (Banco)             │  ← Persistência de dados
└─────────────────────────────────────┘
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 20 ou superior
- PostgreSQL 16 ou superior
- npm ou yarn

### Passo 1: Instalar Dependências

```bash
cd backend
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ava_nps?schema=public"
DIRECT_URL="postgresql://usuario:senha@localhost:5432/ava_nps?schema=public"

# JWT
JWT_SECRET="sua_chave_secreta_jwt_super_segura_aqui_altere_em_producao"

# Servidor
PORT=3001
NODE_ENV=development

# Email (Opcional - para notificações)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

**⚠️ IMPORTANTE**: Em produção, use uma chave JWT forte e única, gerada aleatoriamente.

### Passo 3: Configurar Banco de Dados

1. Crie o banco de dados:

```sql
CREATE DATABASE ava_nps;
```

2. Execute as migrações:

```bash
npx prisma migrate dev
```

3. (Opcional) Gere dados de teste:

```bash
npx prisma studio
# Ou execute o script SQL: psql -d ava_nps -f seed-data.sql
```

### Passo 4: Iniciar o Servidor

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor estará disponível em `http://localhost:3001`

A documentação Swagger estará em `http://localhost:3001/api-docs`

---

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrações do banco
├── src/
│   ├── config/
│   │   └── swagger.js         # Configuração do Swagger
│   ├── middleware/
│   │   ├── auth.js            # Middleware de autenticação
│   │   ├── errorHandler.js    # Tratamento de erros
│   │   ├── logging.js         # Sistema de logs (novo)
│   │   └── validate.js        # Validação de requisições
│   ├── routes/
│   │   ├── authRoutes.js      # Rotas de autenticação
│   │   ├── ticketRoutes.js    # Rotas de tickets
│   │   ├── taskRoutes.js      # Rotas de tarefas
│   │   ├── avaliacaoRoutes.js # Rotas de avaliações
│   │   ├── tokenRoutes.js     # Rotas de tokens
│   │   ├── dashboardRoutes.js # Rotas do dashboard
│   │   ├── notificationRoutes.js # Rotas de notificações
│   │   ├── uploadRoutes.js    # Rotas de upload
│   │   └── logRoutes.js       # Rotas de logs (novo)
│   ├── services/
│   │   ├── emailService.js    # Serviço de email
│   │   ├── tokenService.js    # Serviço de tokens
│   │   └── logService.js      # Serviço de logs (novo)
│   ├── validators/
│   │   ├── authSchemas.js     # Schemas de validação de auth
│   │   ├── ticketSchemas.js   # Schemas de validação de tickets
│   │   ├── taskSchemas.js     # Schemas de validação de tarefas
│   │   └── avaliacaoSchemas.js # Schemas de validação de avaliações
│   ├── tests/
│   │   ├── auth.test.js       # Testes de autenticação
│   │   └── ticket.test.js     # Testes de tickets
│   └── server.js              # Arquivo principal do servidor
├── uploads/                   # Diretório de uploads
├── .env.example               # Exemplo de variáveis de ambiente
├── package.json
└── README.md
```

---

## 🗄️ Banco de Dados

### Schema Principal

O banco de dados utiliza Prisma como ORM. Os principais modelos são:

#### User (Usuário)
- Armazena informações dos usuários do sistema
- Roles: ADMIN, GESTOR, ATENDENTE, CLIENTE

#### Ticket
- Representa um ticket de atendimento
- Status: ABERTO, EM_ANDAMENTO, FINALIZADO, AGUARDANDO_ATENDIMENTO, AGUARDANDO_CLIENTE, CANCELADO
- Categorias: DUVIDA, INCIDENTE, SOLICITACAO, MELHORIA
- Urgência: BAIXA, MEDIA, ALTA, CRITICA

#### Task (Tarefa)
- Representa uma tarefa do sistema
- Status: PENDENTE, EM_ANDAMENTO, CONCLUIDA, CANCELADA, EM_ESPERA
- Prioridade: BAIXA, MEDIA, ALTA

#### Avaliacao
- Armazena avaliações NPS dos clientes
- Campos: sistema (nota), atendimento (nota), comentario

#### Log (Novo)
- Armazena logs de todas as ações dos usuários
- Tipos de ação: CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW, DOWNLOAD, UPLOAD, EXPORT, ASSIGN, TRANSFER, COMPLETE, CANCEL, OTHER

### Comandos Úteis do Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Abrir Prisma Studio (interface visual)
npx prisma studio

# Resetar banco de dados (CUIDADO: apaga todos os dados)
npx prisma migrate reset
```

---

## 🔌 API Endpoints

### Autenticação

#### POST /auth/login
Autentica um usuário e retorna um token JWT.

**Request:**
```json
{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "nome": "João",
    "email": "usuario@example.com",
    "tipo": "ADMIN"
  },
  "token": "jwt_token_aqui"
}
```

#### POST /auth/register
Registra um novo usuário.

**Request:**
```json
{
  "nome": "João",
  "email": "joao@example.com",
  "senha": "senha123",
  "tipo": "ATENDENTE"
}
```

### Tickets

#### GET /tickets
Lista todos os tickets (com filtros e paginação).

**Query Parameters:**
- `search` - Busca por título/descrição
- `status` - Filtrar por status
- `categoria` - Filtrar por categoria
- `urgencia` - Filtrar por urgência
- `page` - Número da página
- `limit` - Itens por página

#### POST /tickets
Cria um novo ticket.

#### PUT /tickets/:id
Atualiza um ticket existente.

#### DELETE /tickets/:id
Deleta um ticket.

### Tarefas

#### GET /tasks
Lista todas as tarefas.

#### POST /tasks
Cria uma nova tarefa.

#### PUT /tasks/:id
Atualiza uma tarefa.

#### DELETE /tasks/:id
Deleta uma tarefa.

### Avaliações

#### POST /avaliacoes
Cria uma nova avaliação NPS.

#### GET /avaliacoes
Lista todas as avaliações.

### Tokens

#### POST /tokens
Gera um novo token de avaliação.

#### GET /tokens/:valor
Valida um token de avaliação.

#### PUT /tokens/:valor/usar
Marca um token como usado.

### Dashboard

#### GET /dashboard/stats
Retorna estatísticas do dashboard.

### Notificações

#### GET /notifications
Lista notificações do usuário autenticado.

#### PUT /notifications/:id/read
Marca uma notificação como lida.

### Logs (Novo)

#### GET /logs
Lista logs do sistema.

**Query Parameters:**
- `userId` - Filtrar por usuário
- `action` - Filtrar por tipo de ação
- `entity` - Filtrar por entidade
- `startDate` - Data de início
- `endDate` - Data de fim
- `page` - Número da página
- `limit` - Itens por página

**Permissões:**
- ADMIN e GESTOR podem ver todos os logs
- Outros usuários só veem seus próprios logs

#### GET /logs/:id
Busca um log específico por ID.

### Upload

#### POST /upload
Faz upload de um arquivo.

**Form Data:**
- `file` - Arquivo a ser enviado

**Response:**
```json
{
  "filename": "arquivo.pdf",
  "path": "/uploads/arquivo.pdf",
  "url": "http://localhost:3001/uploads/arquivo.pdf"
}
```

---

## 🔐 Autenticação e Autorização

### JWT (JSON Web Tokens)

O sistema utiliza JWT para autenticação. O token deve ser enviado no header:

```
Authorization: Bearer <token>
```

### Roles (Papéis)

- **ADMIN**: Acesso total ao sistema
- **GESTOR**: Acesso de gerenciamento
- **ATENDENTE**: Pode gerenciar tickets e tarefas
- **CLIENTE**: Acesso limitado

### Proteção de Rotas

As rotas protegidas utilizam o middleware `authenticateToken`:

```javascript
const { authenticateToken } = require('./middleware/auth');

router.get('/protegida', authenticateToken, (req, res) => {
  // req.user contém os dados do usuário autenticado
  res.json({ user: req.user });
});
```

---

## 📊 Sistema de Logs

O sistema possui um sistema completo de logs que registra todas as ações dos usuários.

### Características

- ✅ Registro automático de ações (CREATE, UPDATE, DELETE, etc.)
- ✅ Logs de login e registro
- ✅ Armazenamento no banco de dados
- ✅ Filtros e busca avançada
- ✅ Controle de permissões (ADMIN/GESTOR veem tudo)
- ✅ Detalhes completos (IP, User Agent, timestamp)

### Tipos de Ação

- `CREATE` - Criação de registros
- `UPDATE` - Atualização de registros
- `DELETE` - Exclusão de registros
- `LOGIN` - Login no sistema
- `LOGOUT` - Logout do sistema
- `VIEW` - Visualização de dados
- `DOWNLOAD` - Download de arquivos
- `UPLOAD` - Upload de arquivos
- `EXPORT` - Exportação de dados
- `ASSIGN` - Atribuição de recursos
- `TRANSFER` - Transferência de recursos
- `COMPLETE` - Finalização de tarefas
- `CANCEL` - Cancelamento de operações
- `OTHER` - Outras ações

### Uso Programático

```javascript
const LogService = require('./services/logService');

// Criar um log manualmente
await LogService.createLog({
  userId: user.id,
  action: 'CREATE',
  entity: 'Ticket',
  entityId: ticket.id,
  description: 'Usuário criou um novo ticket',
  details: { /* dados adicionais */ },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});
```

### Middleware Automático

O middleware `loggingMiddleware` registra automaticamente as ações:

```javascript
const { loggingMiddleware } = require('./middleware/logging');

router.use('/tickets', authenticateToken, loggingMiddleware, ticketRoutes);
```

---

## 🛡️ Middleware

### authenticateToken

Valida o token JWT e adiciona `req.user` à requisição.

### errorHandler

Trata erros globais e retorna respostas padronizadas.

### loggingMiddleware

Registra automaticamente ações dos usuários.

### validate

Valida o body da requisição usando schemas Joi.

---

## ✅ Validação

O sistema utiliza Joi para validação de dados. Os schemas estão em `src/validators/`.

Exemplo de schema:

```javascript
const Joi = require('joi');

const ticketSchema = Joi.object({
  titulo: Joi.string().required(),
  descricao: Joi.string().required(),
  categoria: Joi.string().valid('DUVIDA', 'INCIDENTE', 'SOLICITACAO', 'MELHORIA').required(),
  // ...
});
```

---

## 🔧 Serviços

### EmailService

Envia emails de notificação.

```javascript
const { sendEmail } = require('./services/emailService');

await sendEmail({
  to: 'usuario@example.com',
  subject: 'Novo Ticket',
  text: 'Você tem um novo ticket atribuído'
});
```

### TokenService

Gera e valida tokens de avaliação NPS.

### LogService

Gerencia logs do sistema (ver seção Sistema de Logs).

---

## 🧪 Testes

### Executar Testes

```bash
npm test
```

### Testes de Integração

```bash
npm run test:integration
```

---

## 🚢 Deploy

### Docker

O projeto inclui suporte a Docker. Para executar:

```bash
docker-compose up -d
```

Ver `docker-compose.yml` e `Dockerfile` para mais detalhes.

### Variáveis de Ambiente em Produção

Certifique-se de definir:
- `DATABASE_URL` - URL do banco de dados de produção
- `JWT_SECRET` - Chave secreta forte
- `NODE_ENV=production`

---

## 🔍 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### Erro de conexão com o banco

Verifique as variáveis `DATABASE_URL` e `DIRECT_URL` no `.env`.

### Token inválido

Verifique se `JWT_SECRET` está configurado corretamente.

### Logs não aparecem

Verifique se o middleware `loggingMiddleware` está sendo usado nas rotas.

---

## 📝 Notas Adicionais

- O servidor suporta CORS para `http://localhost:5173` (frontend)
- Arquivos uploadados são salvos em `backend/uploads/`
- A documentação Swagger está disponível em `/api-docs`
- Logs são armazenados permanentemente no banco de dados

---

**Última atualização**: 2024

