import { api } from './api';
import type { Task, TaskFormData } from '../types';

export interface TaskFilters {
  status?: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  tag?: 'TREINAMENTO' | 'IMPLANTACAO' | 'SUPORTE_TECNICO' | 'DESENVOLVIMENTO' | 'MANUTENCAO';
  sistema?: 'CONTROLID' | 'TIME_PRO' | 'BINARTECH' | 'AHGORA' | 'SIMPAX';
  responsavelId?: string;
  criadoPor?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface TaskStats {
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidas: number;
  canceladas: number;
}

export interface TaskResponse {
  task: Task;
  message: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const taskService = {
  // Criar nova tarefa
  async createTask(data: TaskFormData): Promise<TaskResponse> {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Listar todas as tarefas com paginação e filtros
  async getTasks(
    page: number = 1,
    limit: number = 10,
    filters?: TaskFilters
  ): Promise<TasksResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/tasks?${params}`);
    return response.data;
  },

  // Obter tarefa por ID
  async getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Atualizar tarefa
  async updateTask(id: string, data: Partial<TaskFormData>): Promise<TaskResponse> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  // Deletar tarefa
  async deleteTask(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Atualizar status da tarefa
  async updateTaskStatus(
    id: string, 
    status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'
  ): Promise<TaskResponse> {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Atribuir responsável à tarefa
  async assignTask(id: string, responsavelId: string): Promise<TaskResponse> {
    const response = await api.patch(`/tasks/${id}/assign`, { responsavelId });
    return response.data;
  },

  // Obter estatísticas das tarefas
  async getTaskStats(filters?: TaskFilters): Promise<TaskStats> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';
    
    const response = await api.get(`/tasks/stats${params ? `?${params}` : ''}`);
    return response.data;
  },

  // Obter tarefas do usuário logado
  async getMyTasks(
    page: number = 1,
    limit: number = 10,
    filters?: TaskFilters
  ): Promise<TasksResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/tasks/my-tasks?${params}`);
    return response.data;
  },

  // Upload de vídeo para tarefa
  async uploadTaskVideo(id: string, file: File): Promise<{ videoUrl: string }> {
    const formData = new FormData();
    formData.append('video', file);

    const response = await api.post(`/tasks/${id}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Buscar tarefas por texto
  async searchTasks(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TasksResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/tasks/search?${params}`);
    return response.data;
  },

  // Exportar tarefas para CSV
  async exportTasks(filters?: TaskFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';

    const response = await api.get(`/tasks/export${params ? `?${params}` : ''}`, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 