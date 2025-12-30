import { api } from './api';

export interface Log {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW' | 'DOWNLOAD' | 'UPLOAD' | 'EXPORT' | 'ASSIGN' | 'TRANSFER' | 'COMPLETE' | 'CANCEL' | 'OTHER';
  entity: string;
  entityId?: string;
  description: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  };
}

export interface LogFilters {
  userId?: string;
  action?: Log['action'];
  entity?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface LogsResponse {
  logs: Log[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const logService = {
  // Listar logs com filtros
  async getLogs(filters: LogFilters = {}): Promise<LogsResponse> {
    const params = new URLSearchParams();
    
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.action) params.append('action', filters.action);
    if (filters.entity) params.append('entity', filters.entity);
    if (filters.entityId) params.append('entityId', filters.entityId);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/logs?${params.toString()}`);
    return response.data;
  },

  // Buscar log específico por ID
  async getLogById(logId: string): Promise<Log> {
    const response = await api.get(`/logs/${logId}`);
    return response.data;
  },
};

