# Documentação Completa do Frontend - Sistema NPS

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Componentes](#componentes)
6. [Páginas](#páginas)
7. [Serviços e APIs](#serviços-e-apis)
8. [Contextos](#contextos)
9. [Hooks Customizados](#hooks-customizados)
10. [Roteamento](#roteamento)
11. [Estilização](#estilização)
12. [Build e Deploy](#build-e-deploy)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O frontend do Sistema NPS é uma aplicação React moderna construída com TypeScript, Vite e TailwindCSS, oferecendo uma interface completa para gerenciamento de tickets, tarefas e avaliações NPS.

### Tecnologias Principais

- **React** 19.x - Biblioteca JavaScript
- **TypeScript** 5.x - Tipagem estática
- **Vite** 6.x - Build tool e dev server
- **React Router** 7.x - Roteamento
- **TailwindCSS** 4.x - Framework CSS
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificações
- **Recharts** - Gráficos
- **Lucide React** - Ícones

### Funcionalidades Principais

- ✅ Autenticação completa (Login/Registro)
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de Tickets (CRUD completo)
- ✅ Gerenciamento de Tarefas (CRUD completo)
- ✅ Sistema de Avaliação NPS
- ✅ Notificações em tempo real
- ✅ Perfil do usuário
- ✅ Configurações
- ✅ Design responsivo
- ✅ Tema claro (suporte para tema escuro preparado)

---

## 🏗️ Arquitetura

O frontend segue uma arquitetura baseada em componentes:

```
┌─────────────────────────────────────┐
│         Pages (Páginas)             │  ← Rotas da aplicação
├─────────────────────────────────────┤
│      Components (Componentes)       │  ← Componentes reutilizáveis
├─────────────────────────────────────┤
│      Contexts (Contextos)           │  ← Estado global (React Context)
├─────────────────────────────────────┤
│      Services (Serviços)            │  ← Comunicação com API
├─────────────────────────────────────┤
│      Hooks (Hooks Customizados)     │  ← Lógica reutilizável
└─────────────────────────────────────┘
```

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 20 ou superior
- npm ou yarn

### Passo 1: Instalar Dependências

```bash
cd frontend
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3001
```

### Passo 3: Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Outros Comandos

```bash
# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Linter
npm run lint
```

---

## 📁 Estrutura do Projeto

```
frontend/
├── public/                    # Arquivos estáticos
├── src/
│   ├── components/            # Componentes React
│   │   ├── evaluation/        # Componentes de avaliação
│   │   │   └── EvaluationForm.tsx
│   │   ├── layout/            # Componentes de layout
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── tasks/             # Componentes de tarefas
│   │   │   ├── TaskForm.tsx
│   │   │   └── TaskList.tsx
│   │   └── tickets/           # Componentes de tickets
│   │       ├── TicketForm.tsx
│   │       └── TicketList.tsx
│   ├── config/                # Configurações
│   │   └── env.ts             # Configuração de variáveis de ambiente
│   ├── contexts/              # Contextos React
│   │   ├── AuthContext.tsx    # Contexto de autenticação
│   │   ├── ModalContext.tsx   # Contexto de modais
│   │   ├── NotificationContext.tsx # Contexto de notificações
│   │   ├── ThemeContext.tsx   # Contexto de tema
│   │   └── ToastContext.tsx   # Contexto de toast
│   ├── hooks/                 # Hooks customizados
│   │   ├── useAuth.ts         # Hook de autenticação
│   │   ├── useDashboard.ts    # Hook do dashboard
│   │   ├── useError.ts        # Hook de erros
│   │   ├── useLoading.ts      # Hook de loading
│   │   └── index.ts
│   ├── pages/                 # Páginas da aplicação
│   │   ├── Auth.tsx           # Página de login/registro
│   │   ├── Dashboard.tsx      # Dashboard principal
│   │   ├── Tickets.tsx        # Lista de tickets
│   │   ├── NewTicket.tsx      # Criar/editar ticket
│   │   ├── TicketView.tsx     # Visualizar ticket
│   │   ├── Tasks.tsx          # Lista de tarefas
│   │   ├── NewTask.tsx        # Criar/editar tarefa
│   │   ├── TokenGenerator.tsx # Gerador de tokens
│   │   ├── Profile.tsx        # Perfil do usuário
│   │   ├── Config.tsx         # Configurações
│   │   ├── Notificacoes.tsx   # Notificações
│   │   ├── Ajuda.tsx          # Ajuda
│   │   ├── Api.tsx            # Documentação da API
│   │   └── Chat.tsx           # Chat (preparado)
│   ├── services/              # Serviços de API
│   │   ├── api.ts             # Cliente Axios configurado
│   │   ├── authService.ts     # Serviço de autenticação
│   │   ├── ticketService.ts   # Serviço de tickets
│   │   ├── taskService.ts     # Serviço de tarefas
│   │   ├── avaliacaoService.ts # Serviço de avaliações
│   │   ├── dashboardService.ts # Serviço do dashboard
│   │   ├── notificationService.ts # Serviço de notificações
│   │   ├── tokenService.ts    # Serviço de tokens
│   │   ├── uploadService.ts   # Serviço de upload
│   │   └── index.ts
│   ├── types/                 # Tipos TypeScript
│   │   └── index.ts           # Definições de tipos
│   ├── utils/                 # Utilitários
│   │   └── testIntegration.ts
│   ├── App.tsx                # Componente raiz
│   ├── main.tsx               # Ponto de entrada
│   └── index.css              # Estilos globais
├── .env.example               # Exemplo de variáveis de ambiente
├── index.html                 # HTML principal
├── package.json
├── tailwind.config.js         # Configuração do TailwindCSS
├── tsconfig.json              # Configuração do TypeScript
├── vite.config.ts             # Configuração do Vite
└── README.md
```

---

## 🧩 Componentes

### Layout Components

#### MainLayout
Layout principal que envolve todas as páginas autenticadas. Inclui Sidebar e Header.

#### Sidebar
Menu lateral com navegação. Responsivo (hamburguer em mobile).

#### Header
Cabeçalho da aplicação com informações do usuário.

#### Modal
Componente de modal reutilizável com tamanhos configuráveis (sm, md, lg, xl).

#### Toast
Sistema de notificações toast.

#### LoadingSpinner
Indicador de carregamento.

### Feature Components

#### TicketForm
Formulário completo para criar/editar tickets com validação.

#### TicketList
Lista de tickets com filtros, busca e paginação.

#### TaskForm
Formulário para criar/editar tarefas.

#### TaskList
Lista de tarefas com visualização em lista/grid.

#### EvaluationForm
Formulário de avaliação NPS (público, não requer autenticação).

---

## 📄 Páginas

### Auth
Página de login/registro com toggle entre os dois modos.

**Rotas:**
- `/` - Página de autenticação

### Dashboard
Dashboard principal com estatísticas e gráficos.

**Rota:** `/dashboard`

**Funcionalidades:**
- Cards com estatísticas (tickets, tarefas, etc.)
- Gráficos de desempenho
- Filtros por período

### Tickets

#### Lista de Tickets (`/tickets`)
- Lista todos os tickets
- Filtros avançados (status, categoria, urgência)
- Busca por título/descrição
- Paginação
- Exportação CSV

#### Novo Ticket (`/tickets/novo`)
- Formulário para criar novo ticket
- Upload de anexos
- Validação em tempo real

#### Editar Ticket (`/tickets/editar/:id`)
- Formulário para editar ticket existente
- Mesmas funcionalidades do formulário de criação

#### Visualizar Ticket (`/tickets/:id`)
- Visualização detalhada do ticket
- Histórico de alterações
- Ações rápidas

### Tarefas

#### Lista de Tarefas (`/tarefas`)
- Lista todas as tarefas
- Visualização em lista ou grid
- Filtros dinâmicos
- Ordenação por coluna
- Exportação CSV

#### Nova Tarefa (`/tarefas/nova`)
- Formulário para criar nova tarefa
- Campos: título, descrição, tag, prioridade, datas, etc.

### TokenGenerator (`/token-generator`)
Gerador de tokens para avaliação NPS.

### Profile (`/profile`)
Perfil do usuário com informações e opções de edição.

### Config (`/configuracoes`)
Configurações do usuário (tema, idioma, notificações).

### Notificacoes (`/notificacoes`)
Lista de notificações do usuário.

### Ajuda (`/ajuda`)
Página de ajuda e documentação.

### Api (`/api`)
Documentação da API (Swagger embutido).

---

## 🔌 Serviços e APIs

Todos os serviços estão em `src/services/` e utilizam o cliente Axios configurado em `api.ts`.

### api.ts
Cliente Axios com interceptors para:
- Adicionar token JWT automaticamente
- Tratar erros de autenticação
- Redirecionar para login se não autenticado

### authService.ts
```typescript
login(data: LoginData): Promise<AuthResponse>
register(data: RegisterData): Promise<AuthResponse>
getProfile(): Promise<User>
updateProfile(data: Partial<User>): Promise<User>
logout(): void
```

### ticketService.ts
```typescript
getTickets(filters?): Promise<Ticket[]>
getTicket(id: string): Promise<Ticket>
createTicket(data: CreateTicketData): Promise<Ticket>
updateTicket(id: string, data: UpdateTicketData): Promise<Ticket>
deleteTicket(id: string): Promise<void>
exportTickets(filters?): Promise<Blob>
```

### taskService.ts
```typescript
getTasks(filters?): Promise<Task[]>
getTask(id: string): Promise<Task>
createTask(data: CreateTaskData): Promise<Task>
updateTask(id: string, data: UpdateTaskData): Promise<Task>
deleteTask(id: string): Promise<void>
exportTasks(filters?): Promise<Blob>
```

### dashboardService.ts
```typescript
getStats(filters?): Promise<DashboardStats>
```

### notificationService.ts
```typescript
getNotifications(): Promise<Notification[]>
markAsRead(id: string): Promise<void>
```

---

## 🎭 Contextos

### AuthContext
Gerencia o estado de autenticação global.

**Hooks:**
- `useAuth()` - Hook para acessar contexto de autenticação
- `useAuthContext()` - Hook alternativo

**Estado:**
- `user` - Dados do usuário
- `token` - Token JWT
- `isAuthenticated` - Se está autenticado
- `isLoading` - Estado de carregamento

**Métodos:**
- `login()` - Fazer login
- `register()` - Registrar usuário
- `logout()` - Fazer logout
- `updateUser()` - Atualizar dados do usuário

### ModalContext
Gerencia modais globais.

### NotificationContext
Gerencia notificações do sistema.

### ThemeContext
Gerencia tema (claro/escuro) - preparado para futuro.

### ToastContext
Gerencia mensagens toast.

---

## 🪝 Hooks Customizados

### useAuth
Hook simplificado para autenticação.

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### useDashboard
Hook para dados do dashboard.

```typescript
const { stats, loading, error, refresh } = useDashboard();
```

### useLoading
Hook para gerenciar estado de loading.

```typescript
const { isLoading, startLoading, stopLoading } = useLoading();
```

### useError
Hook para gerenciar erros.

```typescript
const { error, setError, clearError } = useError();
```

---

## 🛣️ Roteamento

O roteamento é feito com React Router 7.

### Rotas Públicas

- `/` - Autenticação (login/registro)
- `/evaluate/:token` - Formulário de avaliação (público)

### Rotas Protegidas

Todas as outras rotas requerem autenticação. O componente `PrivateRoute` verifica autenticação e redireciona para `/` se não autenticado.

```typescript
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
```

---

## 🎨 Estilização

### TailwindCSS

O projeto utiliza TailwindCSS 4.x para estilização.

**Cores Principais:**
- Primária: Purple (`purple-600`, `purple-700`)
- Secundária: Gray (`gray-50`, `gray-900`)
- Status:
  - Sucesso: Green (`green-50`, `green-700`)
  - Erro: Red (`red-50`, `red-700`)
  - Aviso: Yellow (`yellow-50`, `yellow-700`)

### Responsividade

O design é totalmente responsivo com breakpoints:
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

### Componentes Estilizados

Alguns componentes têm estilos próprios:
- `GradientButton` - Botão com gradiente
- `RedButton` - Botão vermelho para ações destrutivas
- `Chip` - Badge/chip para tags

---

## 🏗️ Build e Deploy

### Build para Produção

```bash
npm run build
```

Isso gera os arquivos otimizados em `dist/`.

### Preview do Build

```bash
npm run preview
```

### Deploy

#### Vercel / Netlify
Conecte o repositório e configure:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_API_URL`

#### Docker
O projeto inclui Dockerfile. Veja `Dockerfile` e `docker-compose.yml`.

#### Servidor Estático
Sirva os arquivos de `dist/` com qualquer servidor estático (Nginx, Apache, etc.).

**⚠️ IMPORTANTE**: Configure o servidor para redirecionar todas as rotas para `index.html` (SPA routing).

---

## 🔍 Troubleshooting

### Erro: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS

Verifique se `VITE_API_URL` está correto e se o backend permite CORS do frontend.

### Páginas não carregam após deploy

Configure o servidor para redirecionar todas as rotas para `index.html` (SPA routing).

### Erro de autenticação

Verifique se o token está sendo salvo no localStorage e se o backend está acessível.

---

## 📝 Notas Adicionais

- O token JWT é armazenado no `localStorage` com a chave `@AvaNPS:token`
- Os dados do usuário são armazenados no `localStorage` com a chave `user`
- A aplicação é uma SPA (Single Page Application)
- O roteamento é client-side (não requer configuração de servidor para rotas)
- Todos os formulários têm validação em tempo real
- As notificações são exibidas usando React Hot Toast

---

**Última atualização**: 2024

