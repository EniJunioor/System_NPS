import React, { useState, useEffect } from 'react';
import { logService, type Log, type LogFilters } from '../services';
import { useToast } from '../contexts/ToastContext';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { LoadingSpinner } from '../components/layout/LoadingSpinner';

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<LogFilters>({
    page: 1,
    limit: 50,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const { showToast } = useToast();

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await logService.getLogs(filters);
      setLogs(response.logs);
      setPagination(response.pagination);
    } catch (error: any) {
      showToast('error', 'Erro ao carregar logs', error.response?.data?.error || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filters.page, filters.limit, filters.action, filters.entity, filters.userId, filters.startDate, filters.endDate]);

  const handleFilterChange = (key: keyof LogFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset page when filter changes
    }));
  };

  const actionColors: Record<Log['action'], string> = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    LOGIN: 'bg-purple-100 text-purple-800',
    LOGOUT: 'bg-gray-100 text-gray-800',
    VIEW: 'bg-yellow-100 text-yellow-800',
    DOWNLOAD: 'bg-indigo-100 text-indigo-800',
    UPLOAD: 'bg-pink-100 text-pink-800',
    EXPORT: 'bg-cyan-100 text-cyan-800',
    ASSIGN: 'bg-orange-100 text-orange-800',
    TRANSFER: 'bg-teal-100 text-teal-800',
    COMPLETE: 'bg-emerald-100 text-emerald-800',
    CANCEL: 'bg-rose-100 text-rose-800',
    OTHER: 'bg-slate-100 text-slate-800',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Logs do Sistema</h1>
        <p className="text-gray-600">Visualize todas as ações realizadas no sistema</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.action || ''}
              onChange={(e) => handleFilterChange('action', e.target.value || undefined)}
            >
              <option value="">Todas</option>
              <option value="CREATE">Criar</option>
              <option value="UPDATE">Atualizar</option>
              <option value="DELETE">Deletar</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="VIEW">Visualizar</option>
              <option value="DOWNLOAD">Download</option>
              <option value="UPLOAD">Upload</option>
              <option value="EXPORT">Exportar</option>
              <option value="ASSIGN">Atribuir</option>
              <option value="TRANSFER">Transferir</option>
              <option value="COMPLETE">Completar</option>
              <option value="CANCEL">Cancelar</option>
              <option value="OTHER">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entidade</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.entity || ''}
              onChange={(e) => handleFilterChange('entity', e.target.value || undefined)}
            >
              <option value="">Todas</option>
              <option value="Ticket">Ticket</option>
              <option value="Task">Tarefa</option>
              <option value="User">Usuário</option>
              <option value="Auth">Autenticação</option>
              <option value="Token">Token</option>
              <option value="Avaliacao">Avaliação</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={loadLogs}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Lista de Logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum log encontrado
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.user.nome}</div>
                        <div className="text-sm text-gray-500">{log.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${actionColors[log.action]}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.entity}
                        {log.entityId && (
                          <span className="text-gray-500 ml-1">#{log.entityId.substring(0, 8)}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {log.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} até {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} logs
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('page', pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handleFilterChange('page', pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

