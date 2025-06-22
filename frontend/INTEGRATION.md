# Integração Frontend-Backend - Sistema NPS

## Visão Geral

Este documento descreve a integração completa e robusta entre o frontend React/TypeScript e o backend Node.js/Express do Sistema NPS.

## Estrutura da Integração

### 1. Configuração da API

#### `src/config/env.ts`
- Centraliza as configurações da API
- Permite configuração via variáveis de ambiente
- Configurações padrão para desenvolvimento

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
};
```

#### `src/services/api.ts`
- Configuração base do Axios
- Interceptors para autenticação automática
- Tratamento global de erros
- Redirecionamento automático em caso de token expirado

### 2. Serviços Especializados

#### Autenticação (`authService.ts`)
- Login e registro de usuários
- Gerenciamento de perfil
- Validação de tokens
- Alteração de senha
- Gerenciamento de usuários (admin)

#### Tarefas (`taskService.ts`)
- CRUD completo de tarefas
- Filtros avançados e paginação
- Upload de vídeos
- Estatísticas e relatórios
- Exportação de dados

#### Tickets (`ticketService.ts`)
- CRUD completo de tickets
- Sistema de comentários
- Atribuição de responsáveis
- Priorização e resolução
- Relatórios de performance

#### Avaliações (`avaliacaoService.ts`)
- Criação de avaliações NPS
- Validação de tokens
- Estatísticas e métricas
- Relatórios executivos
- Exportação de dados

#### Tokens (`tokenService.ts`)
- Geração de tokens únicos
- Validação e uso
- Gerenciamento de expiração
- Relatórios de utilização

#### Dashboard (`dashboardService.ts`)
- Estatísticas em tempo real
- Gráficos e métricas
- Atividades recentes
- Alertas e notificações
- Relatórios executivos

#### Notificações (`notificationService.ts`)
- Sistema de notificações em tempo real
- Preferências personalizáveis
- Histórico de notificações
- Webhooks para integração

### 3. Hooks Personalizados

#### `useAuth.ts`
- Gerenciamento completo de autenticação
- Validação automática de tokens
- Persistência de dados
- Tratamento de erros

#### `useLoading.ts`
- Controle de estados de loading
- Loading automático para operações assíncronas
- Interface limpa e reutilizável

#### `useError.ts`
- Tratamento centralizado de erros
- Formatação automática de mensagens
- Integração com sistema de toasts

### 4. Componentes de UI

#### `LoadingSpinner.tsx`
- Spinner reutilizável
- Overlay de loading global
- Animações suaves

#### `Toast.tsx`
- Sistema de notificações toast
- Múltiplos tipos (success, error, warning, info)
- Animações e auto-dismiss
- Posicionamento global

### 5. Contextos

#### `AuthContext.tsx`
- Estado global de autenticação
- Métodos de login/logout
- Dados do usuário logado

#### `ToastContext.tsx`
- Gerenciamento global de toasts
- Fila de notificações
- Controle de duração e posicionamento

## Funcionalidades Implementadas

### Autenticação e Autorização
- ✅ Login com email e senha
- ✅ Registro de novos usuários
- ✅ Validação automática de tokens
- ✅ Redirecionamento automático
- ✅ Gerenciamento de perfil
- ✅ Controle de acesso por rotas

### Gerenciamento de Tarefas
- ✅ Criação, edição e exclusão
- ✅ Filtros por status, tag, sistema
- ✅ Paginação e busca
- ✅ Upload de vídeos
- ✅ Atribuição de responsáveis
- ✅ Estatísticas detalhadas

### Sistema de Tickets
- ✅ Criação e gerenciamento
- ✅ Sistema de prioridades
- ✅ Comentários e histórico
- ✅ Atribuição de atendentes
- ✅ Resolução e reabertura
- ✅ Relatórios de performance

### Avaliações NPS
- ✅ Criação de avaliações
- ✅ Validação de tokens
- ✅ Cálculo de métricas NPS
- ✅ Relatórios executivos
- ✅ Exportação de dados

### Geração de Tokens
- ✅ Geração individual e em lote
- ✅ Validação e uso
- ✅ Controle de expiração
- ✅ Relatórios de utilização

### Dashboard
- ✅ Métricas em tempo real
- ✅ Gráficos interativos
- ✅ Atividades recentes
- ✅ Alertas importantes
- ✅ Relatórios executivos

### Notificações
- ✅ Sistema de toasts
- ✅ Notificações em tempo real
- ✅ Preferências personalizáveis
- ✅ Histórico completo

## Padrões de Desenvolvimento

### Tratamento de Erros
- Interceptors globais no Axios
- Hooks especializados para erro
- Mensagens de erro amigáveis
- Logs detalhados para debugging

### Estados de Loading
- Loading automático para operações
- Spinners contextuais
- Overlay global quando necessário
- Feedback visual claro

### Validação de Dados
- Validação no frontend
- Validação no backend
- Mensagens de erro claras
- Prevenção de dados inválidos

### Segurança
- Tokens JWT
- Validação automática
- Redirecionamento seguro
- Sanitização de dados

## Como Usar

### 1. Configuração Inicial
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### 2. Uso dos Serviços
```typescript
import { taskService, useToast } from '../services';

// Em um componente
const { showToast } = useToast();

const handleCreateTask = async (data) => {
  try {
    const result = await taskService.createTask(data);
    showToast('success', 'Tarefa criada com sucesso!');
  } catch (error) {
    showToast('error', 'Erro ao criar tarefa', error.message);
  }
};
```

### 3. Hooks Personalizados
```typescript
import { useAuth, useLoading, useError } from '../hooks';

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();
  const { isLoading, withLoading } = useLoading();
  const { error, handleError } = useError();

  const handleAction = async () => {
    await withLoading(async () => {
      // Operação assíncrona
    });
  };
};
```

## Estrutura de Arquivos

```
frontend/src/
├── config/
│   └── env.ts                 # Configurações da API
├── services/
│   ├── api.ts                 # Configuração base do Axios
│   ├── authService.ts         # Serviços de autenticação
│   ├── taskService.ts         # Serviços de tarefas
│   ├── ticketService.ts       # Serviços de tickets
│   ├── avaliacaoService.ts    # Serviços de avaliações
│   ├── tokenService.ts        # Serviços de tokens
│   ├── dashboardService.ts    # Serviços do dashboard
│   ├── notificationService.ts # Serviços de notificações
│   └── index.ts               # Exportações centralizadas
├── hooks/
│   ├── useAuth.ts             # Hook de autenticação
│   ├── useLoading.ts          # Hook de loading
│   ├── useError.ts            # Hook de erro
│   └── index.ts               # Exportações
├── contexts/
│   ├── AuthContext.tsx        # Contexto de autenticação
│   ├── ToastContext.tsx       # Contexto de toasts
│   └── ModalContext.tsx       # Contexto de modais
├── components/
│   └── layout/
│       ├── LoadingSpinner.tsx # Componente de loading
│       └── Toast.tsx          # Componente de toast
└── types/
    └── index.ts               # Tipos TypeScript
```

## Próximos Passos

1. **Testes**: Implementar testes unitários e de integração
2. **Performance**: Otimizar carregamento e cache
3. **PWA**: Transformar em Progressive Web App
4. **Offline**: Implementar funcionalidades offline
5. **Real-time**: Adicionar WebSockets para atualizações em tempo real
6. **Analytics**: Implementar tracking de eventos
7. **Acessibilidade**: Melhorar acessibilidade (ARIA, navegação por teclado)
8. **Internacionalização**: Suporte a múltiplos idiomas

## Considerações de Segurança

- Todos os endpoints protegidos requerem autenticação
- Tokens JWT com expiração configurável
- Validação de dados no frontend e backend
- Sanitização de inputs
- Headers de segurança configurados
- CORS configurado adequadamente

## Performance

- Lazy loading de componentes
- Paginação em todas as listas
- Cache de dados quando apropriado
- Otimização de imagens e assets
- Compressão de respostas da API
- Debounce em inputs de busca

Esta integração fornece uma base sólida e escalável para o Sistema NPS, com todas as funcionalidades necessárias implementadas de forma robusta e bem estruturada. 