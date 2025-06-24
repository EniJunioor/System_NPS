import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, List, LayoutGrid, Clock, CheckCircle2, AlertOctagon, Eye, Edit2 } from 'lucide-react';
import Modal from '../components/layout/Modal';
import TaskForm from '../components/tasks/TaskForm';
import type { Task, TaskFormData } from '../types';
import { taskService } from '../services/taskService';
import type { TaskFilters as BaseTaskFilters } from '../services/taskService';
import { saveAs } from 'file-saver';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos os status' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONCLUIDA', label: 'Concluída' },
  { value: 'CANCELADA', label: 'Cancelada' },
];
const TAG_OPTIONS = [
  { value: '', label: 'Todas as tags' },
  { value: 'TREINAMENTO', label: 'Treinamento' },
  { value: 'IMPLANTACAO', label: 'Implantação' },
  { value: 'SUPORTE_TECNICO', label: 'Suporte Técnico' },
  { value: 'DESENVOLVIMENTO', label: 'Desenvolvimento' },
  { value: 'MANUTENCAO', label: 'Manutenção' },
];
const SISTEMA_OPTIONS = [
  { value: '', label: 'Todos os sistemas' },
  { value: 'CONTROLID', label: 'ControlID' },
  { value: 'TIME_PRO', label: 'Time Pro' },
  { value: 'BINARTECH', label: 'Binartech' },
  { value: 'AHGORA', label: 'Ahgora' },
  { value: 'SIMPAX', label: 'Simpax' },
];

type TaskType = Task & { prioridade?: string };

type TaskFilters = BaseTaskFilters & { search?: string; sortBy?: string; order?: 'asc' | 'desc' };

export default function Tasks() {
  const [viewMode, setViewMode] = useState('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskFormData | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [tag, setTag] = useState('');
  const [sistema, setSistema] = useState('');
  const [stats, setStats] = useState({ total: 0, pendentes: 0, emAndamento: 0, concluidas: 0, canceladas: 0 });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Atualiza tarefas e estatísticas ao mudar filtros
  useEffect(() => {
    setLoading(true);
    const filters: TaskFilters = {};
    if (status) filters.status = status as TaskFilters['status'];
    if (tag) filters.tag = tag as TaskFilters['tag'];
    if (sistema) filters.sistema = sistema as TaskFilters['sistema'];
    if (search) filters.search = search;
    const filtersWithSort: Record<string, unknown> = { ...filters };
    if (sortBy) filtersWithSort.sortBy = sortBy;
    if (sortOrder) filtersWithSort.order = sortOrder;
    Promise.all([
      taskService.getTasks(1, 20, filtersWithSort),
      taskService.getTaskStats(filters)
    ])
      .then(([tasksRes, statsRes]) => {
        setTasks(tasksRes.tasks);
        setStats(statsRes);
        setError(null);
      })
      .catch(() => setError('Erro ao carregar tarefas'))
      .finally(() => setLoading(false));
  }, [status, tag, sistema, search, sortBy, sortOrder]);

  const mapTaskToFormData = (task: TaskType): TaskFormData => ({
    descricao: task.descricao || '',
    duracao: task.duracao || '',
    tag: task.tag || 'SUPORTE_TECNICO',
    sistema: (['CONTROLID', 'TIME_PRO', 'BINARTECH', 'AHGORA', 'SIMPAX'].includes(task.sistema || '') ? task.sistema : undefined) as TaskFormData['sistema'],
    responsavelId: task.responsavel?.id || '',
    videoUrl: task.videoUrl || '',
  });

  const handleView = (task: TaskType) => {
    setSelectedTask(mapTaskToFormData(task));
    setModalMode('view');
    setModalOpen(true);
  };
  const handleEdit = (task: TaskType) => {
    setSelectedTask(mapTaskToFormData(task));
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setModalMode(null);
  };

  // Função de submit de edição (placeholder)
  const handleSubmitEdit = (data: TaskFormData) => {
    alert('Salvar edição da tarefa: ' + data.descricao);
    handleCloseModal();
  };

  // Exportação CSV
  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await taskService.exportTasks({
        status: status as TaskFilters['status'],
        tag: tag as TaskFilters['tag'],
        sistema: sistema as TaskFilters['sistema'],
        ...(search ? { search } : {})
      });
      saveAs(blob, 'tarefas.csv');
    } catch {
      setError('Erro ao exportar CSV');
    } finally {
      setLoading(false);
    }
  };

  // Exclusão de tarefa
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    setDeletingId(id);
    try {
      await taskService.deleteTask(id);
      setTasks(tasks => tasks.filter(t => t.id !== id));
      setStats(s => ({ ...s, total: s.total - 1 }));
    } catch {
      setError('Erro ao excluir tarefa');
    } finally {
      setDeletingId(null);
    }
  };

  const summaryCards = [
    { label: 'Total de Tarefas', value: stats.total, icon: List, color: 'text-blue-500 bg-blue-100' },
    { label: 'Pendentes', value: stats.pendentes, icon: Clock, color: 'text-yellow-500 bg-yellow-100' },
    { label: 'Em Andamento', value: stats.emAndamento, icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
    { label: 'Concluídas', value: stats.concluidas, icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
    { label: 'Canceladas', value: stats.canceladas, icon: AlertOctagon, color: 'text-red-500 bg-red-100' },
  ];

  // Função utilitária para extrair o título
  function getTitulo(task: TaskType) {
    if (typeof task.descricao === 'string' && task.descricao.length > 0) return task.descricao;
    if ('id' in task) return String(task.id);
    return '';
  }

  // Função para alternar ordenação
  function handleSort(col: string) {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
  }

  return (
    <div className="p-6 bg-gray-50/30 w-full space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tarefas</h1>
          <p className="text-gray-500">Gerencie suas tarefas e projetos</p>
        </div>
        <div className="flex items-center gap-4">
            <Link to="/tarefas/nova">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-sm hover:opacity-90 transition-all duration-200 hover:scale-105 cursor-pointer">
                    <Plus size={18} />
                    Nova Tarefa
                </button>
            </Link>
            <img src="https://i.pravatar.cc/150?u=user" alt="User" className="w-10 h-10 rounded-full" />
        </div>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-5 border border-gray-100">
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-sm hover:opacity-90 transition-all duration-200 hover:scale-105 cursor-pointer mb-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Exportar CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-purple-500 focus:border-purple-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-md bg-white w-full md:w-auto"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.value ? opt.label : 'Todos os status'}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-md bg-white w-full md:w-auto"
          value={tag}
          onChange={e => setTag(e.target.value)}
        >
          {TAG_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.value ? opt.label : 'Todas as tags'}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-md bg-white w-full md:w-auto"
          value={sistema}
          onChange={e => setSistema(e.target.value)}
        >
          {SISTEMA_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.value ? opt.label : 'Todos os sistemas'}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}>
                <List size={20} className="text-gray-600" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}>
                <LayoutGrid size={20} className="text-gray-600" />
            </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className={`px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none ${sortBy === 'id' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => handleSort('id')}>ID {sortBy === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th className={`px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none ${sortBy === 'titulo' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => handleSort('titulo')}>TÍTULO {sortBy === 'titulo' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th className={`px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none ${sortBy === 'descricao' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => handleSort('descricao')}>DESCRIÇÃO {sortBy === 'descricao' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th className={`px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none ${sortBy === 'sistema' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => handleSort('sistema')}>SISTEMA {sortBy === 'sistema' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th className={`px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none ${sortBy === 'status' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => handleSort('status')}>STATUS {sortBy === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th className={`px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none ${sortBy === 'prioridade' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => handleSort('prioridade')}>PRIORIDADE {sortBy === 'prioridade' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th className={`px-4 py-2 text-left text-xs font-semibold cursor-pointer select-none ${sortBy === 'createdAt' ? 'text-blue-600' : 'text-gray-500'}`} onClick={() => handleSort('createdAt')}>CRIADO EM {sortBy === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={8} className="text-center text-gray-500 py-4">Carregando tarefas...</td></tr>
                )}
                {error && (
                  <tr><td colSpan={8} className="text-center text-red-500 py-4">{error}</td></tr>
                )}
                {!loading && !error && tasks.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-gray-400 py-4">Nenhuma tarefa encontrada.</td></tr>
                )}
                {!loading && !error && tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-xs text-gray-500 max-w-[120px] truncate">{task.id}</td>
                    <td className="px-4 py-2 font-bold text-gray-900 max-w-[180px] truncate" title={getTitulo(task)}>{getTitulo(task)}</td>
                    <td className="px-4 py-2 text-gray-800 max-w-[220px] truncate">
                      <span title={task.descricao}>{task.descricao}</span>
                    </td>
                    <td className="px-4 py-2 text-xs text-blue-700">{task.sistema}</td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{task.status}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{task.prioridade || '-'}</span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        title="Visualizar"
                        className="p-2 rounded hover:bg-blue-100 text-blue-600"
                        onClick={() => handleView(task)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        title="Editar"
                        className="p-2 rounded hover:bg-yellow-100 text-yellow-600"
                        onClick={() => handleEdit(task)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        title="Excluir"
                        className={`p-2 rounded hover:bg-red-100 text-red-600 ${deletingId === task.id ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => handleDelete(task.id)}
                        disabled={deletingId === task.id}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading && <div className="col-span-full text-center text-gray-500 py-4">Carregando tarefas...</div>}
            {error && <div className="col-span-full text-center text-red-500 py-4">{error}</div>}
            {!loading && !error && tasks.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-4">Nenhuma tarefa encontrada.</div>
            )}
            {!loading && !error && tasks.map(task => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-2 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-gray-900 truncate" title={getTitulo(task)}>{getTitulo(task)}</span>
                  {task.duracao && <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">⏱ {task.duracao}</span>}
                </div>
                <div className="text-sm text-gray-700 truncate" title={task.descricao}>{task.descricao}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {task.sistema && <span className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-0.5">{task.sistema}</span>}
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{task.status}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">{task.prioridade || '-'}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</span>
                  <div className="flex gap-2">
                    <button
                      title="Visualizar"
                      className="p-2 rounded hover:bg-blue-100 text-blue-600"
                      onClick={() => handleView(task)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      title="Editar"
                      className="p-2 rounded hover:bg-yellow-100 text-yellow-600"
                      onClick={() => handleEdit(task)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      title="Excluir"
                      className={`p-2 rounded hover:bg-red-100 text-red-600 ${deletingId === task.id ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal de visualização/edição */}
      {modalOpen && selectedTask && (
        <Modal onClose={handleCloseModal}>
          <TaskForm
            initialData={selectedTask}
            onCancel={handleCloseModal}
            onSubmit={handleSubmitEdit}
            isLoading={false}
            users={[]}
            readOnly={modalMode === 'view'}
          />
        </Modal>
      )}
    </div>
  );
} 