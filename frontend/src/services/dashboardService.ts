import { api } from './api';

export interface DashboardStats {
  tasks: {
    total: number;
    pendentes: number;
    emAndamento: number;
    concluidas: number;
    canceladas: number;
  };
  tickets: {
    total: number;
    abertos: number;
    emAndamento: number;
    finalizados: number;
    cancelados: number;
    urgentes: number;
  };
  avaliacoes: {
    total: number;
    mediaSistema: number;
    mediaAtendimento: number;
    npsScore: number;
    promotores: number;
    passivos: number;
    detratores: number;
  };
  tokens: {
    total: number;
    usados: number;
    naoUsados: number;
    expirados: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface DashboardCharts {
  tasksByStatus: ChartData;
  ticketsByStatus: ChartData;
  ticketsByPriority: ChartData;
  avaliacoesByScore: ChartData;
  npsTrend: ChartData;
  tasksByTag: ChartData;
  ticketsByPeriod: ChartData;
  avaliacoesByPeriod: ChartData;
}

export interface RecentActivity {
  id: string;
  type: 'task' | 'ticket' | 'avaliacao' | 'token';
  action: string;
  description: string;
  user: {
    id: string;
    nome: string;
  };
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetrics {
  tasksCompleted: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
  averageTaskCompletionTime: number;
  ticketsResolved: number;
  ticketsResolvedThisWeek: number;
  ticketsResolvedThisMonth: number;
  averageTicketResolutionTime: number;
  customerSatisfaction: number;
  npsImprovement: number;
}

export const dashboardService = {
  // Obter estatísticas gerais do dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Obter dados para gráficos
  async getDashboardCharts(): Promise<DashboardCharts> {
    const response = await api.get('/dashboard/charts');
    return response.data;
  },

  // Obter atividades recentes
  async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    const response = await api.get(`/dashboard/recent-activity?limit=${limit}`);
    return response.data;
  },

  // Obter métricas de performance
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const response = await api.get('/dashboard/performance');
    return response.data;
  },

  // Obter estatísticas por período
  async getStatsByPeriod(
    dataInicio: string,
    dataFim: string
  ): Promise<{
    tasks: DashboardStats['tasks'];
    tickets: DashboardStats['tickets'];
    avaliacoes: DashboardStats['avaliacoes'];
    tokens: DashboardStats['tokens'];
  }> {
    const params = new URLSearchParams({
      dataInicio,
      dataFim,
    });

    const response = await api.get(`/dashboard/stats/period?${params}`);
    return response.data;
  },

  // Obter estatísticas do usuário logado
  async getMyStats(): Promise<{
    tasks: {
      total: number;
      pendentes: number;
      emAndamento: number;
      concluidas: number;
    };
    tickets: {
      total: number;
      abertos: number;
      emAndamento: number;
      finalizados: number;
    };
    avaliacoes: {
      total: number;
      mediaSistema: number;
      mediaAtendimento: number;
    };
    tokens: {
      total: number;
      usados: number;
      naoUsados: number;
    };
  }> {
    const response = await api.get('/dashboard/my-stats');
    return response.data;
  },

  // Obter alertas e notificações importantes
  async getAlerts(): Promise<{
    urgentTickets: number;
    overdueTasks: number;
    lowNPS: boolean;
    expiringTokens: number;
  }> {
    const response = await api.get('/dashboard/alerts');
    return response.data;
  },

  // Obter resumo executivo
  async getExecutiveSummary(): Promise<{
    totalRevenue: number;
    customerSatisfaction: number;
    operationalEfficiency: number;
    keyMetrics: {
      [key: string]: number;
    };
    recommendations: string[];
  }> {
    const response = await api.get('/dashboard/executive-summary');
    return response.data;
  },

  // Obter dados para relatórios
  async getReportData(
    reportType: 'tasks' | 'tickets' | 'avaliacoes' | 'tokens' | 'comprehensive',
    filters?: {
      dataInicio?: string;
      dataFim?: string;
      status?: string;
      priority?: string;
      user?: string;
    }
  ): Promise<unknown> {
    const params = new URLSearchParams({
      reportType,
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/dashboard/reports?${params}`);
    return response.data;
  },

  // Exportar relatório do dashboard
  async exportDashboardReport(
    reportType: string,
    format: 'pdf' | 'excel' | 'csv',
    filters?: {
      dataInicio?: string;
      dataFim?: string;
      status?: string;
      priority?: string;
      user?: string;
    }
  ): Promise<Blob> {
    const params = new URLSearchParams({
      reportType,
      format,
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/dashboard/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Obter métricas gerais do sistema (tickets, usuários, tokens)
  async getMetrics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    tokensGenerated: number;
    tokensUsed: number;
    totalTickets: number;
    pendingTickets: number;
    resolvedTickets: number;
    urgentTickets: number;
  }> {
    const response = await api.get('/dashboard/metrics');
    return response.data;
  },
}; 