// Exportar configuração da API
export { API_CONFIG } from '../config/env';

// Exportar instância da API
export * from './api';

// Exportar todos os serviços
export * from './authService';
export * from './taskService';
export * from './ticketService';
export * from './avaliacaoService';
export * from './tokenService';
export * from './dashboardService';
export * from './notificationService';
export * from './uploadService';
export * from './logService';

// Exportar tipos dos serviços
export type {
  LoginData,
  RegisterData,
  AuthResponse,
  UpdateProfileData,
  ChangePasswordData,
} from './authService';

export type {
  TaskFilters,
  TaskStats,
  TaskResponse,
  TasksResponse,
} from './taskService';

export type {
  TicketFilters,
  TicketStats,
  TicketResponse,
  TicketsResponse,
  TicketComment,
} from './ticketService';

export type {
  AvaliacaoData,
  AvaliacaoStats,
  AvaliacaoResponse,
  AvaliacoesResponse,
  TokenData,
} from './avaliacaoService';

export type {
  TokenFormData,
  TokenFilters,
  TokenStats,
  TokenResponse,
  TokensResponse,
} from './tokenService';

export type {
  DashboardStats,
  ChartData,
  DashboardCharts,
  RecentActivity,
  PerformanceMetrics,
} from './dashboardService';

export type {
  Notification,
  NotificationFilters,
  NotificationStats,
  NotificationsResponse,
  NotificationPreferences,
} from './notificationService';

export type {
  Log,
  LogFilters,
  LogsResponse,
} from './logService'; 