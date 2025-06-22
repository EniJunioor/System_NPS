import { api } from './api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  metadata?: {
    entityType?: 'task' | 'ticket' | 'avaliacao' | 'token';
    entityId?: string;
    action?: string;
  };
}

export interface NotificationFilters {
  read?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  dataInicio?: string;
  dataFim?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    info: number;
    success: number;
    warning: number;
    error: number;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  taskUpdates: boolean;
  ticketUpdates: boolean;
  systemAlerts: boolean;
  npsAlerts: boolean;
}

export const notificationService = {
  // Obter notificações do usuário
  async getNotifications(
    page: number = 1,
    limit: number = 10,
    filters?: NotificationFilters
  ): Promise<NotificationsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },

  // Obter notificação por ID
  async getNotificationById(id: string): Promise<Notification> {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  // Marcar notificação como lida
  async markAsRead(id: string): Promise<{ message: string }> {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // Marcar múltiplas notificações como lidas
  async markMultipleAsRead(ids: string[]): Promise<{ message: string; updatedCount: number }> {
    const response = await api.patch('/notifications/mark-read', { ids });
    return response.data;
  },

  // Marcar todas as notificações como lidas
  async markAllAsRead(): Promise<{ message: string; updatedCount: number }> {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  // Deletar notificação
  async deleteNotification(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Deletar múltiplas notificações
  async deleteMultipleNotifications(ids: string[]): Promise<{ message: string; deletedCount: number }> {
    const response = await api.delete('/notifications/bulk', { data: { ids } });
    return response.data;
  },

  // Deletar todas as notificações lidas
  async deleteReadNotifications(): Promise<{ message: string; deletedCount: number }> {
    const response = await api.delete('/notifications/delete-read');
    return response.data;
  },

  // Obter estatísticas das notificações
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  // Obter notificações não lidas
  async getUnreadNotifications(limit: number = 10): Promise<Notification[]> {
    const response = await api.get(`/notifications/unread?limit=${limit}`);
    return response.data;
  },

  // Obter contagem de notificações não lidas
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Configurar preferências de notificação
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  },

  // Obter preferências de notificação
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  // Enviar notificação de teste
  async sendTestNotification(type: 'email' | 'push' | 'sms'): Promise<{ message: string }> {
    const response = await api.post('/notifications/test', { type });
    return response.data;
  },

  // Obter histórico de notificações
  async getNotificationHistory(
    page: number = 1,
    limit: number = 20,
    filters?: NotificationFilters
  ): Promise<NotificationsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/notifications/history?${params}`);
    return response.data;
  },

  // Exportar notificações
  async exportNotifications(
    format: 'csv' | 'json',
    filters?: NotificationFilters
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/notifications/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Configurar webhook para notificações
  async setWebhook(url: string, events: string[]): Promise<{ message: string }> {
    const response = await api.post('/notifications/webhook', { url, events });
    return response.data;
  },

  // Obter configuração do webhook
  async getWebhook(): Promise<{ url: string; events: string[] } | null> {
    const response = await api.get('/notifications/webhook');
    return response.data;
  },

  // Remover webhook
  async removeWebhook(): Promise<{ message: string }> {
    const response = await api.delete('/notifications/webhook');
    return response.data;
  },
}; 