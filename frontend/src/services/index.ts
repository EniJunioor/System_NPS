// Exportar configuração da API
export { API_CONFIG } from '../config/env';

// Exportar instância da API
export { api } from './api';

// Exportar todos os serviços
export { authService } from './authService';
export { taskService } from './taskService';
export { ticketService } from './ticketService';
export { avaliacaoService } from './avaliacaoService';
export { tokenService } from './tokenService';
export { dashboardService } from './dashboardService';
export { notificationService } from './notificationService';

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