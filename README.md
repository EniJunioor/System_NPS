# Sistema de Avaliação NPS

Sistema completo para gerenciamento de tickets, tarefas e avaliação NPS (Net Promoter Score) com frontend em React + TypeScript e backend em Node.js.

## 🚀 Tecnologias

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios
- TailwindCSS
- React Hook Form
- Zod (validação)
- React Query
- React Hot Toast
- file-saver (exportação CSV)

### Backend
- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL (NeonDB)
- JWT (autenticação)
- Nodemailer (e-mail)
- Jest (testes)
- Swagger (documentação)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL (ou NeonDB)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd ava-nps
```

2. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

3. Instale as dependências do backend:
```bash
cd ../backend
npm install
```

4. Configure as variáveis de ambiente:

No diretório `backend`, crie um arquivo `.env`:
```env
DATABASE_URL="sua_url_do_banco"
DIRECT_URL="sua_direct_url_do_banco"
JWT_SECRET="seu_segredo_jwt"
PORT=3001
```

No diretório `frontend`, crie um arquivo `.env`:
```env
VITE_API_URL=http://localhost:3001
```

5. Execute as migrações do banco de dados:
```bash
cd backend
npx prisma migrate dev
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
- [x] Documentação Swagger
- [x] Testes automatizados

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