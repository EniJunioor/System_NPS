# Sistema de Avaliação NPS

Sistema completo para gerenciamento de tickets, tarefas e avaliação NPS (Net Promoter Score) com frontend em React + TypeScript e backend em Node.js.

## 🚀 Tecnologias

### Frontend
- React 19
- TypeScript 5.x
- Vite 6.x
- React Router DOM 7.x
- Axios
- TailwindCSS 4.x
- React Hot Toast
- file-saver (exportação CSV)
- Recharts (gráficos)
- Lucide React (ícones)

### Backend
- Node.js 20+
- Express 4.x
- Prisma 6.x (ORM)
- PostgreSQL 16+
- JWT (autenticação)
- Nodemailer (e-mail)
- Jest (testes)
- Swagger (documentação)
- bcryptjs (hash de senhas)

## 📋 Pré-requisitos

- Node.js 20+
- PostgreSQL 16+ (ou NeonDB)
- npm ou yarn
- Docker e Docker Compose (opcional, para usar containers)

## 🔧 Instalação

### Opção 1: Docker (Recomendado)

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd System_NPS
```

2. Configure as variáveis de ambiente:
   - Copie `backend/.env.example` para `backend/.env` e configure
   - Copie `frontend/.env.example` para `frontend/.env` e configure

3. Inicie os containers:
```bash
docker-compose up -d
```

A aplicação estará disponível em:
- Frontend: http://localhost
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

### Opção 2: Instalação Manual

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd System_NPS
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Configure as variáveis de ambiente:
   - Copie `backend/.env.example` para `backend/.env` e configure:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/ava_nps?schema=public"
   DIRECT_URL="postgresql://usuario:senha@localhost:5432/ava_nps?schema=public"
   JWT_SECRET="sua_chave_secreta_jwt_super_segura_aqui"
   PORT=3001
   NODE_ENV=development
   ```

4. Configure o banco de dados:
```bash
# Criar banco de dados
createdb ava_nps

# Executar migrações
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate
```

5. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

6. Configure as variáveis de ambiente do frontend:
   - Copie `frontend/.env.example` para `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

## 🚀 Executando o projeto

### Backend
```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:3001`
Documentação Swagger disponível em `http://localhost:3001/api-docs`

### Frontend
```bash
cd frontend
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 🧪 Testes

Para executar os testes do backend:
```bash
cd backend
npm test
```

## 📦 Estrutura do Projeto

```
ava-nps/
├── frontend/                # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços e APIs
│   │   ├── contexts/      # Contextos React
│   │   └── types/         # Tipos TypeScript
│   └── ...
│
├── backend/                # Backend Node.js + Express
│   ├── src/
│   │   ├── routes/        # Rotas da API
│   │   ├── controllers/   # Controladores
│   │   ├── middleware/    # Middlewares
│   │   ├── tests/         # Testes
│   │   └── config/        # Configurações
│   └── prisma/            # Schema e migrações do Prisma
│
└── README.md
```

## 🔑 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Os tokens são enviados no header `Authorization` como `Bearer token`.

## 📊 Banco de Dados

O projeto utiliza PostgreSQL com Prisma como ORM. O schema do banco inclui:

- Usuários (ADMIN, GESTOR, ATENDENTE)
- Tickets
- Tarefas
- Tokens
- Avaliações
- Tokens de Avaliação

## ✨ Funcionalidades

- [x] Autenticação de usuários (login, registro, roles)
- [x] Gerenciamento de tickets (criação, edição, exclusão, upload de anexos, atribuição automática, transferência, finalização, filtros, busca, exportação CSV)
- [x] Gerenciamento de tarefas (criação, edição, exclusão, filtros dinâmicos, busca, ordenação por coluna, visualização em lista/grid, exportação CSV, upload/remover anexos, feedback visual, tooltip, badges, indicação de atraso)
- [x] Sistema de avaliação NPS (tokens, avaliações, dashboard)
- [x] Notificações (toast, e-mail)
- [x] Dashboard com estatísticas dinâmicas
- [x] Modal reutilizável, formulários validados em tempo real
- [x] Responsividade total e acessibilidade
- [x] **Sistema de logs completo** - Registra todas as ações dos usuários
- [x] Documentação Swagger
- [x] Testes automatizados
- [x] **Docker e Docker Compose** - Containerização completa
- [x] **Documentação completa** - Frontend e Backend

### Novidades recentes
- Exportação de tarefas para CSV
- Exclusão de tarefas com confirmação
- Ordenação por coluna nas tabelas
- Tooltip de descrição
- Visualização detalhada e ações rápidas
- Correção de linter e tipagem TypeScript

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/SuaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: SuaFeature'`)
4. Push para a branch (`git push origin feature/SuaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 