import React, { useState, useEffect } from 'react';
import { 
  taskService, 
  ticketService, 
  avaliacaoService, 
  tokenService,
  dashboardService,
  notificationService
} from '../services';
import { useAuth, useLoading, useError } from '../hooks';
import { useToast } from '../contexts/ToastContext';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';
import type { Task, Ticket, Avaliacao, Token } from '../types';

// Exemplo de componente de listagem de tarefas
export const TaskListExample: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isLoading, withLoading } = useLoading();
  const { error, handleError } = useError();
  const { showToast } = useToast();

  const loadTasks = async () => {
    await withLoading(async () => {
      try {
        const response = await taskService.getTasks(page, 10);
        setTasks(response.tasks);
        setTotalPages(response.totalPages);
      } catch (error) {
        handleError(error);
        showToast('error', 'Erro ao carregar tarefas');
      }
    });
  };

  const handleCreateTask = async (taskData: any) => {
    await withLoading(async () => {
      try {
        await taskService.createTask(taskData);
        showToast('success', 'Tarefa criada com sucesso!');
        loadTasks(); // Recarrega a lista
      } catch (error) {
        handleError(error);
        showToast('error', 'Erro ao criar tarefa');
      }
    });
  };

  const handleUpdateStatus = async (taskId: string, status: string) => {
    await withLoading(async () => {
      try {
        await taskService.updateTaskStatus(taskId, status as any);
        showToast('success', 'Status atualizado!');
        loadTasks();
      } catch (error) {
        handleError(error);
        showToast('error', 'Erro ao atualizar status');
      }
    });
  };

  useEffect(() => {
    loadTasks();
  }, [page]);

  if (isLoading) return <LoadingSpinner text="Carregando tarefas..." />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lista de Tarefas</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error.message}
        </div>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{task.descricao}</h3>
            <p className="text-gray-600">Status: {task.status}</p>
            <p className="text-gray-600">Tag: {task.tag}</p>
            <button
              onClick={() => handleUpdateStatus(task.id, 'CONCLUIDA')}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Marcar como Concluída
            </button>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

// Exemplo de componente de dashboard
export const DashboardExample: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { isLoading, withLoading } = useLoading();
  const { showToast } = useToast();

  const loadDashboardData = async () => {
    await withLoading(async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentActivity(5)
        ]);
        
        setStats(statsData);
        setRecentActivity(activityData);
      } catch (error) {
        showToast('error', 'Erro ao carregar dados do dashboard');
      }
    });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) return <LoadingSpinner text="Carregando dashboard..." />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Tarefas</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.tasks.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Tickets</h3>
            <p className="text-2xl font-bold text-green-600">{stats.tickets.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Avaliações</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.avaliacoes.total}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">NPS Score</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.avaliacoes.npsScore}</p>
          </div>
        </div>
      )}

      {/* Atividades Recentes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Atividades Recentes</h3>
        <div className="space-y-2">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium">{activity.description}</p>
              <p className="text-sm text-gray-600">
                {activity.user.nome} • {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Exemplo de componente de criação de token
export const TokenGeneratorExample: React.FC = () => {
  const [formData, setFormData] = useState({
    telefone: '',
    atendente: '',
    dataAtendimento: '',
  });
  const { isLoading, withLoading } = useLoading();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await withLoading(async () => {
      try {
        const result = await tokenService.generateToken(formData);
        showToast('success', 'Token gerado com sucesso!', result.token.valor);
        
        // Limpa o formulário
        setFormData({
          telefone: '',
          atendente: '',
          dataAtendimento: '',
        });
      } catch (error) {
        showToast('error', 'Erro ao gerar token');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Gerar Token</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            type="tel"
            value={formData.telefone}
            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Atendente</label>
          <input
            type="text"
            value={formData.atendente}
            onChange={(e) => setFormData(prev => ({ ...prev, atendente: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data do Atendimento</label>
          <input
            type="datetime-local"
            value={formData.dataAtendimento}
            onChange={(e) => setFormData(prev => ({ ...prev, dataAtendimento: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Gerando...' : 'Gerar Token'}
        </button>
      </form>
    </div>
  );
};

// Exemplo de hook personalizado para gerenciar dados
export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const loadTasks = async (filters?: any) => {
    setLoading(true);
    try {
      const response = await taskService.getTasks(1, 50, filters);
      setTasks(response.tasks);
    } catch (error) {
      showToast('error', 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: any) => {
    try {
      const result = await taskService.createTask(taskData);
      setTasks(prev => [result.task, ...prev]);
      showToast('success', 'Tarefa criada com sucesso!');
      return result;
    } catch (error) {
      showToast('error', 'Erro ao criar tarefa');
      throw error;
    }
  };

  const updateTask = async (id: string, data: any) => {
    try {
      const result = await taskService.updateTask(id, data);
      setTasks(prev => prev.map(task => 
        task.id === id ? result.task : task
      ));
      showToast('success', 'Tarefa atualizada com sucesso!');
      return result;
    } catch (error) {
      showToast('error', 'Erro ao atualizar tarefa');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      showToast('success', 'Tarefa excluída com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao excluir tarefa');
      throw error;
    }
  };

  return {
    tasks,
    loading,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}; 