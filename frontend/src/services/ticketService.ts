import { api } from './api';
import type { Ticket, TicketFormData } from '../types';

export interface TicketFilters {
  status?: 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
  priority?: 'baixa' | 'média' | 'alta';
  client?: string;
  atendidoPor?: string;
  criadoPor?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface TicketStats {
  total: number;
  abertos: number;
  emAndamento: number;
  finalizados: number;
  cancelados: number;
  porPrioridade: {
    baixa: number;
    média: number;
    alta: number;
  };
}

export interface TicketResponse {
  ticket: Ticket;
  message: string;
}

export interface TicketsResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketComment {
  id: string;
  content: string;
  author: {
    id: string;
    nome: string;
  };
  createdAt: string;
}

export const ticketService = {
  // Criar novo ticket
  async createTicket(data: TicketFormData): Promise<TicketResponse> {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  // Listar todos os tickets com paginação e filtros
  async getTickets(
    page: number = 1,
    limit: number = 10,
    filters?: TicketFilters
  ): Promise<TicketsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/tickets?${params}`);
    return response.data;
  },

  // Obter ticket por ID
  async getTicketById(id: string): Promise<Ticket> {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Atualizar ticket
  async updateTicket(id: string, data: Partial<TicketFormData>): Promise<TicketResponse> {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },

  // Deletar ticket
  async deleteTicket(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  // Atualizar status do ticket
  async updateTicketStatus(
    id: string, 
    status: 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO'
  ): Promise<TicketResponse> {
    const response = await api.patch(`/tickets/${id}/status`, { status });
    return response.data;
  },

  // Atribuir atendente ao ticket
  async assignTicket(id: string, atendenteId: string): Promise<TicketResponse> {
    const response = await api.patch(`/tickets/${id}/assign`, { atendenteId });
    return response.data;
  },

  // Obter estatísticas dos tickets
  async getTicketStats(filters?: TicketFilters): Promise<TicketStats> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';
    
    const response = await api.get(`/tickets/stats${params ? `?${params}` : ''}`);
    return response.data;
  },

  // Obter tickets do usuário logado
  async getMyTickets(
    page: number = 1,
    limit: number = 10,
    filters?: TicketFilters
  ): Promise<TicketsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/tickets/my-tickets?${params}`);
    return response.data;
  },

  // Adicionar comentário ao ticket
  async addComment(ticketId: string, content: string): Promise<TicketComment> {
    const response = await api.post(`/tickets/${ticketId}/comments`, { content });
    return response.data;
  },

  // Obter comentários do ticket
  async getComments(ticketId: string): Promise<TicketComment[]> {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  // Buscar tickets por texto
  async searchTickets(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TicketsResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/tickets/search?${params}`);
    return response.data;
  },

  // Exportar tickets para CSV
  async exportTickets(filters?: TicketFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';

    const response = await api.get(`/tickets/export${params ? `?${params}` : ''}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Obter tickets urgentes (alta prioridade e abertos)
  async getUrgentTickets(): Promise<Ticket[]> {
    const response = await api.get('/tickets/urgent');
    return response.data;
  },

  // Marcar ticket como resolvido
  async resolveTicket(id: string, resolution: string): Promise<TicketResponse> {
    const response = await api.patch(`/tickets/${id}/resolve`, { resolution });
    return response.data;
  },

  // Reabrir ticket
  async reopenTicket(id: string, reason: string): Promise<TicketResponse> {
    const response = await api.patch(`/tickets/${id}/reopen`, { reason });
    return response.data;
  },
}; 