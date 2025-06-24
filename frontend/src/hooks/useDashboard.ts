import { useState, useCallback, useEffect } from 'react';
import { dashboardService, type DashboardStats, type DashboardCharts, type RecentActivity, type PerformanceMetrics } from '../services/dashboardService';
import { useLoading } from './useLoading';
import { useError } from './useError';
import { authService } from '../services/authService';
import type { User } from '../types';

export function useDashboard() {
  const { isLoading, withLoading } = useLoading();
  const { error, withErrorHandling } = useError();

  // Filtros
  const [dataInicial, setDataInicial] = useState<string>('');
  const [dataFinal, setDataFinal] = useState<string>('');
  const [atendente, setAtendente] = useState<string>('');

  // Dados
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [users, setUsers] = useState<{ id: string; name: string; nome: string; role: string }[]>([]);

  // Carregar estatísticas gerais
  const fetchStats = useCallback(() =>
    withLoading(() => withErrorHandling(async () => {
      const data = await dashboardService.getDashboardStats();
      setStats(data);
      return data;
    })),
  [withLoading, withErrorHandling]);

  // Carregar gráficos
  const fetchCharts = useCallback(() =>
    withLoading(() => withErrorHandling(async () => {
      const data = await dashboardService.getDashboardCharts();
      setCharts(data);
      return data;
    })),
  [withLoading, withErrorHandling]);

  // Carregar atividades recentes
  const fetchActivities = useCallback((limit = 10) =>
    withLoading(() => withErrorHandling(async () => {
      const data = await dashboardService.getRecentActivity(limit);
      setActivities(data);
      return data;
    })),
  [withLoading, withErrorHandling]);

  // Carregar métricas de performance
  const fetchPerformance = useCallback(() =>
    withLoading(() => withErrorHandling(async () => {
      const data = await dashboardService.getPerformanceMetrics();
      setPerformance(data);
      return data;
    })),
  [withLoading, withErrorHandling]);

  // Carregar estatísticas por período
  const fetchStatsByPeriod = useCallback((dataInicio: string, dataFim: string) =>
    withLoading(() => withErrorHandling(async () => {
      const data = await dashboardService.getStatsByPeriod(dataInicio, dataFim);
      setStats(s => ({ ...s, ...data } as DashboardStats));
      return data;
    })),
  [withLoading, withErrorHandling]);

  // Buscar usuários ao montar
  useEffect(() => {
    authService.getUsers()
      .then((users: any[]) => setUsers(users.map((u) => ({
        id: u.id,
        name: u.name || u.nome || '',
        nome: u.nome || u.name || '',
        role: u.role || u.tipo || ''
      })))).catch(() => setUsers([]));
  }, []);

  return {
    isLoading,
    error,
    stats,
    charts,
    activities,
    performance,
    dataInicial,
    setDataInicial,
    dataFinal,
    setDataFinal,
    atendente,
    setAtendente,
    fetchStats,
    fetchCharts,
    fetchActivities,
    fetchPerformance,
    fetchStatsByPeriod,
    users,
    setUsers,
  };
} 