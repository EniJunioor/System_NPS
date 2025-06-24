import { useState, useEffect, useContext } from 'react';
import type { Task } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext';
import GradientButton from '../layout/GradientButton';
import RedButton from '../layout/RedButton';
import { useAuth } from '../../hooks/useAuth';
import { Eye, Edit2, CheckCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  isLoading?: boolean;
  users: Array<{ id: string; name: string; role: string }>;
  onTransfer: (taskId: string, responsavelId: string) => void;
  onView?: (task: Task) => void;
}

const TaskList = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  isLoading = false,
  users,
  onTransfer,
  onView
}: TaskListProps) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'TODOS'>('TODOS');
  const [tagFilter, setTagFilter] = useState<Task['tag'] | 'TODOS'>('TODOS');
  const [sistemaFilter, setSistemaFilter] = useState<Task['sistema'] | 'TODOS'>('TODOS');
  const [transferTaskId, setTransferTaskId] = useState<string | null>(null);
  const [selectedResponsavel, setSelectedResponsavel] = useState<string>('');

  useEffect(() => {
    let filtered = [...tasks];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.duracao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.criadoPor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.responsavel?.nome.toLowerCase().includes(searchTerm.toLowerCase()) || false)
      );
    }

    // Filtro por status
    if (statusFilter !== 'TODOS') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filtro por tag
    if (tagFilter !== 'TODOS') {
      filtered = filtered.filter(task => task.tag === tagFilter);
    }

    // Filtro por sistema
    if (sistemaFilter !== 'TODOS') {
      filtered = filtered.filter(task => task.sistema === sistemaFilter);
    }

    // Ordenação por data de criação (mais recente primeiro)
    filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, tagFilter, sistemaFilter]);

  const getStatusColor = (status: Task['status']) => {
    if (isDarkMode) {
      switch (status) {
        case 'PENDENTE': return 'text-yellow-400 bg-yellow-900/20';
        case 'EM_ANDAMENTO': return 'text-blue-400 bg-blue-900/20';
        case 'CONCLUIDA': return 'text-green-400 bg-green-900/20';
        case 'CANCELADA': return 'text-red-400 bg-red-900/20';
        default: return 'text-gray-400 bg-gray-900/20';
      }
    } else {
      switch (status) {
        case 'PENDENTE': return 'text-yellow-600 bg-yellow-100';
        case 'EM_ANDAMENTO': return 'text-blue-600 bg-blue-100';
        case 'CONCLUIDA': return 'text-green-600 bg-green-100';
        case 'CANCELADA': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    }
  };

  const getTagColor = (tag: Task['tag']) => {
    if (isDarkMode) {
      switch (tag) {
        case 'TREINAMENTO': return 'text-blue-400 bg-blue-900/20';
        case 'IMPLANTACAO': return 'text-green-400 bg-green-900/20';
        case 'SUPORTE_TECNICO': return 'text-yellow-400 bg-yellow-900/20';
        case 'DESENVOLVIMENTO': return 'text-purple-400 bg-purple-900/20';
        case 'MANUTENCAO': return 'text-orange-400 bg-orange-900/20';
        default: return 'text-gray-400 bg-gray-900/20';
      }
    } else {
      switch (tag) {
        case 'TREINAMENTO': return 'text-blue-600 bg-blue-100';
        case 'IMPLANTACAO': return 'text-green-600 bg-green-100';
        case 'SUPORTE_TECNICO': return 'text-yellow-600 bg-yellow-100';
        case 'DESENVOLVIMENTO': return 'text-purple-600 bg-purple-100';
        case 'MANUTENCAO': return 'text-orange-600 bg-orange-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    }
  };

  const getSistemaColor = (sistema: Task['sistema']) => {
    if (!sistema) return '';
    
    if (isDarkMode) {
      switch (sistema) {
        case 'CONTROLID': return 'text-red-400 bg-red-900/20';
        case 'TIME_PRO': return 'text-blue-400 bg-blue-900/20';
        case 'BINARTECH': return 'text-green-400 bg-green-900/20';
        case 'AHGORA': return 'text-purple-400 bg-purple-900/20';
        case 'SIMPAX': return 'text-orange-400 bg-orange-900/20';
        default: return 'text-gray-400 bg-gray-900/20';
      }
    } else {
      switch (sistema) {
        case 'CONTROLID': return 'text-red-600 bg-red-100';
        case 'TIME_PRO': return 'text-blue-600 bg-blue-100';
        case 'BINARTECH': return 'text-green-600 bg-green-100';
        case 'AHGORA': return 'text-purple-600 bg-purple-100';
        case 'SIMPAX': return 'text-orange-600 bg-orange-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    }
  };

  const getSistemaIcon = (sistema: Task['sistema']) => {
    switch (sistema) {
      case 'CONTROLID': return '🔴';
      case 'TIME_PRO': return '🔵';
      case 'BINARTECH': return '🟢';
      case 'AHGORA': return '🟣';
      case 'SIMPAX': return '🟠';
      default: return '🖥️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filtros e Busca */}
      <div className={`p-4 sm:p-6 rounded-lg shadow-sm border transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {/* Busca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              🔍 Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descrição, duração, responsável..."
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
                isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
              }`}
            />
          </div>

          {/* Filtro por Status */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              📊 Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Task['status'] | 'TODOS')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
                isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="TODOS">Todos os Status</option>
              <option value="PENDENTE">⏳ Pendente</option>
              <option value="EM_ANDAMENTO">🔄 Em Andamento</option>
              <option value="CONCLUIDA">✅ Concluída</option>
              <option value="CANCELADA">❌ Cancelada</option>
            </select>
          </div>

          {/* Filtro por Tag */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              🏷️ Tag
            </label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value as Task['tag'] | 'TODOS')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
                isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="TODOS">Todas as Tags</option>
              <option value="TREINAMENTO">🎓 Treinamento</option>
              <option value="IMPLANTACAO">🚀 Implantação</option>
              <option value="SUPORTE_TECNICO">🔧 Suporte Técnico</option>
              <option value="DESENVOLVIMENTO">💻 Desenvolvimento</option>
              <option value="MANUTENCAO">🔨 Manutenção</option>
            </select>
          </div>

          {/* Filtro por Sistema */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              🖥️ Sistema
            </label>
            <select
              value={sistemaFilter}
              onChange={(e) => setSistemaFilter(e.target.value as Task['sistema'] | 'TODOS')}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
                isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="TODOS">Todos os Sistemas</option>
              <option value="CONTROLID">🔴 ControlID</option>
              <option value="TIME_PRO">🔵 Time PRO</option>
              <option value="BINARTECH">🟢 BinarTech</option>
              <option value="AHGORA">🟣 Ahgora</option>
              <option value="SIMPAX">🟠 Simpax</option>
            </select>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          <span className={`px-2 sm:px-3 py-1 rounded-full font-medium ${
            isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
          }`}>
            📊 Total: {filteredTasks.length} tarefa{filteredTasks.length !== 1 ? 's' : ''}
          </span>
          <span className={`px-2 sm:px-3 py-1 rounded-full font-medium ${
            isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
          }`}>
            ⏳ Pendentes: {filteredTasks.filter(t => t.status === 'PENDENTE').length}
          </span>
          <span className={`px-2 sm:px-3 py-1 rounded-full font-medium ${
            isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}>
            🔄 Em Andamento: {filteredTasks.filter(t => t.status === 'EM_ANDAMENTO').length}
          </span>
          <span className={`px-2 sm:px-3 py-1 rounded-full font-medium ${
            isDarkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-600'
          }`}>
            ✅ Concluídas: {filteredTasks.filter(t => t.status === 'CONCLUIDA').length}
          </span>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className={`text-center py-12 rounded-lg border-2 border-dashed transition-all duration-300 ${
            isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="text-6xl mb-4">📝</div>
            <h3 className={`text-lg font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Nenhuma tarefa encontrada
            </h3>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {searchTerm || statusFilter !== 'TODOS' || tagFilter !== 'TODOS' || sistemaFilter !== 'TODOS'
                ? 'Tente ajustar os filtros de busca'
                : 'Crie sua primeira tarefa para começar'
              }
            </p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 sm:p-6 rounded-lg shadow-sm border transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Conteúdo Principal */}
                <div className="flex-1 space-y-3 sm:space-y-4">
                  {/* Cabeçalho */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${getStatusColor(task.status)}`}>
                        {task.status === 'PENDENTE' && '⏳ Pendente'}
                        {task.status === 'EM_ANDAMENTO' && '🔄 Em Andamento'}
                        {task.status === 'CONCLUIDA' && '✅ Concluída'}
                        {task.status === 'CANCELADA' && '❌ Cancelada'}
                      </span>
                      
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${getTagColor(task.tag)}`}>
                        {task.tag === 'TREINAMENTO' && '🎓 Treinamento'}
                        {task.tag === 'IMPLANTACAO' && '🚀 Implantação'}
                        {task.tag === 'SUPORTE_TECNICO' && '🔧 Suporte Técnico'}
                        {task.tag === 'DESENVOLVIMENTO' && '💻 Desenvolvimento'}
                        {task.tag === 'MANUTENCAO' && '🔨 Manutenção'}
                      </span>

                      {task.sistema && (
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${getSistemaColor(task.sistema)}`}>
                          {getSistemaIcon(task.sistema)} {task.sistema}
                        </span>
                      )}
                    </div>

                    <div className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      📅 {formatDate(task.createdAt)}
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <p className={`text-sm leading-relaxed ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {task.descricao}
                    </p>
                    {task.videoUrl && (
                      <a
                        href={task.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-blue-600 dark:text-blue-400 underline text-xs sm:text-sm hover:text-blue-800 transition-all"
                      >
                        🎥 Assistir vídeo
                      </a>
                    )}
                  </div>

                  {/* Informações Adicionais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className={`font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        ⏱️ Duração:
                      </span>
                      <span className={`ml-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {task.duracao}
                      </span>
                    </div>

                    <div>
                      <span className={`font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        👤 Criado por:
                      </span>
                      <span className={`ml-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {task.criadoPor.nome}
                      </span>
                    </div>

                    {task.responsavel && (
                      <div>
                        <span className={`font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          🎯 Responsável:
                        </span>
                        <span className={`ml-2 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                          {task.responsavel.nome}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className={`font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        🔄 Atualizado:
                      </span>
                      <span className={`ml-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {formatDate(task.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-2 lg:flex-col">
                  {/* Mudança de Status */}
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
                    className={`px-2 sm:px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm transition-all duration-300 ${
                      isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="PENDENTE">⏳ Pendente</option>
                    <option value="EM_ANDAMENTO">🔄 Em Andamento</option>
                    <option value="CONCLUIDA">✅ Concluída</option>
                    <option value="CANCELADA">❌ Cancelada</option>
                  </select>

                  {/* Botão Finalizar */}
                  {(task.status !== 'CONCLUIDA' && task.status !== 'CANCELADA') && (
                    <GradientButton
                      onClick={() => onStatusChange(task.id, 'CONCLUIDA')}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2 mt-2 sm:mt-0 transform transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      ✅ Finalizar
                    </GradientButton>
                  )}

                  {/* Botão Transferir */}
                  {(user?.tipo === 'ADMIN' || user?.tipo === 'GESTOR' || task.responsavel?.id === user?.id) && (
                    <div className="mt-2">
                      {transferTaskId === task.id ? (
                        <div className="flex flex-col gap-2">
                          <select
                            value={selectedResponsavel}
                            onChange={e => setSelectedResponsavel(e.target.value)}
                            className={`px-2 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
                          >
                            <option value="">Selecione o novo responsável</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <GradientButton
                              onClick={() => { onTransfer(task.id, selectedResponsavel); setTransferTaskId(null); setSelectedResponsavel(''); }}
                              disabled={!selectedResponsavel}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2"
                            >
                              🔄 Confirmar
                            </GradientButton>
                            <RedButton
                              onClick={() => { setTransferTaskId(null); setSelectedResponsavel(''); }}
                              className="text-xs sm:text-sm px-2 sm:px-3 py-2"
                            >
                              Cancelar
                            </RedButton>
                          </div>
                        </div>
                      ) : (
                        <GradientButton
                          onClick={() => setTransferTaskId(task.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2"
                        >
                          🔄 Transferir
                        </GradientButton>
                      )}
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex gap-2">
                    <button
                      title="Ver detalhes"
                      className="p-2 rounded hover:bg-blue-100 text-blue-600"
                      onClick={() => onView && onView(task)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      title="Editar"
                      className="p-2 rounded hover:bg-yellow-100 text-yellow-600"
                      onClick={() => onEdit(task)}
                    >
                      <Edit2 size={18} />
                    </button>
                    {task.status !== 'CONCLUIDA' && (
                      <button
                        title="Finalizar"
                        className="p-2 rounded hover:bg-green-100 text-green-600"
                        onClick={() => onStatusChange(task.id, 'CONCLUIDA')}
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList; 