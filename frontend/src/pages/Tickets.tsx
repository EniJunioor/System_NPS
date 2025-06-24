import React, { useState, useEffect } from 'react';
import { Plus, Filter, Eye, Edit, Package, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { dashboardService } from '../services/dashboardService';
import type { Ticket } from '../types';
import Modal from '../components/layout/Modal';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Aberto', value: 'ABERTO' },
  { label: 'Em andamento', value: 'EM_ANDAMENTO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
  { label: 'Aguardando Atendimento', value: 'AGUARDANDO_ATENDIMENTO' },
  { label: 'Aguardando Cliente', value: 'AGUARDANDO_CLIENTE' },
];

const priorityOptions = [
  { label: 'Todas as prioridades', value: '' },
  { label: 'Alta', value: 'alta' },
  { label: 'Média', value: 'média' },
  { label: 'Baixa', value: 'baixa' },
];

export default function Tickets() {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [summary, setSummary] = useState({
    total: 0,
    pendentes: 0,
    resolvidos: 0,
    urgentes: 0,
  });
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (status) filters.status = status;
      if (priority) filters.urgencia = priority;
      if (search) filters.search = search;
      const res = await ticketService.getTickets(page, 10, filters);
      setTickets(res.tickets);
      setTotalPages(res.totalPages || 1);
      setTotalResults(res.total || 0);
    } catch {
      setTickets([]);
      setTotalPages(1);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    dashboardService.getMetrics().then((data: {
      totalTickets: number;
      pendingTickets: number;
      resolvedTickets: number;
      urgentTickets: number;
    }) => {
      setSummary({
        total: data.totalTickets,
        pendentes: data.pendingTickets,
        resolvidos: data.resolvedTickets,
        urgentes: data.urgentTickets,
      });
    });
    // eslint-disable-next-line
  }, [status, priority, search, page]);

  const openViewModal = async (ticketId: string) => {
    setModalOpen(true);
    setLoading(true);
    try {
      const ticket = await ticketService.getTicketById(ticketId);
      setSelectedTicket(ticket);
    } catch (error) {
      console.error("Failed to fetch ticket for view modal", error);
      // Idealmente, mostrar um toast/erro para o usuário
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedTicket(null);
  };

  // Utilitários para status/prioridade
  function getStatusColor(status: string) {
    switch (status) {
      case 'ABERTO': return 'bg-blue-100 text-blue-700';
      case 'EM_ANDAMENTO': return 'bg-yellow-100 text-yellow-800';
      case 'FINALIZADO': return 'bg-green-100 text-green-700';
      case 'AGUARDANDO_ATENDIMENTO': return 'bg-yellow-100 text-yellow-800';
      case 'AGUARDANDO_CLIENTE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
  function getStatusLabel(status: string) {
    switch (status) {
      case 'ABERTO': return 'Aberto';
      case 'EM_ANDAMENTO': return 'Em andamento';
      case 'FINALIZADO': return 'Finalizado';
      case 'AGUARDANDO_ATENDIMENTO': return 'Aguardando Atendimento';
      case 'AGUARDANDO_CLIENTE': return 'Aguardando Cliente';
      default: return status;
    }
  }
  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'baixa': return 'bg-gray-100 text-gray-600';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'alta': return 'bg-red-100 text-red-600';
      case 'urgente': return 'bg-red-500 text-white';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  return (
    <div className="w-full p-6 space-y-6 bg-gray-50/30">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tickets</h1>
          <p className="text-gray-500">Gerencie seus tickets de suporte</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-md cursor-pointer"
          onClick={() => navigate('/tickets/novo')}
        >
          <Plus size={18} />
          Novo Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="p-3 rounded-full text-blue-500 bg-blue-100">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="p-3 rounded-full text-yellow-500 bg-yellow-100">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-gray-800">{summary.pendentes}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="p-3 rounded-full text-green-500 bg-green-100">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Resolvidos</p>
            <p className="text-2xl font-bold text-gray-800">{summary.resolvidos}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="p-3 rounded-full text-red-500 bg-red-100">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Urgentes</p>
            <p className="text-2xl font-bold text-gray-800">{summary.urgentes}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Buscar tickets..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-purple-500 focus:border-purple-500"
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="px-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-purple-500 focus:border-purple-500">
          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <select value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }} className="px-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-purple-500 focus:border-purple-500">
          {priorityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <button className="p-2.5 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 text-gray-600">
          <Filter size={18} />
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs font-semibold border-b border-gray-200">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">DESCRIÇÃO</th>
              <th className="px-4 py-3 text-left">CLIENTE</th>
              <th className="px-4 py-3 text-left">STATUS</th>
              <th className="px-4 py-3 text-left">PRIORIDADE</th>
              <th className="px-4 py-3 text-left">CRIADO EM</th>
              <th className="px-4 py-3 text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Carregando...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8">Nenhum ticket encontrado.</td></tr>
            ) : tickets.map(ticket => (
              <tr key={ticket.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50/50">
                <td className="px-4 py-3 font-semibold text-gray-700">#{ticket.id}</td>
                <td className="px-4 py-3">
                  <div className="font-bold text-gray-800">{ticket.descricao}</div>
                  <div className="text-gray-500 text-xs">{ticket.client || ''}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {ticket.criadoPor?.nome && (
                      <span className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {ticket.criadoPor.nome[0]}
                      </span>
                    )}
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{ticket.criadoPor?.nome || '-'}</div>
                      <div className="text-xs text-gray-500">{ticket.criadoPor?.email || '-'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>{getStatusLabel(ticket.status)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticket.urgencia || '')}`}>{ticket.urgencia}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 font-medium">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-purple-100 hover:border-purple-400 text-purple-500 hover:text-purple-700 transition-all duration-150 mr-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    onClick={() => openViewModal(ticket.id)}
                    title="Visualizar"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-blue-100 hover:border-blue-400 text-blue-500 hover:text-blue-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => navigate(`/tickets/editar/${ticket.id}`)}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Mostrando {tickets.length > 0 ? ((page - 1) * 10 + 1) : 0} a {((page - 1) * 10) + tickets.length} de {totalResults} resultados</span>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16}/></button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3.5 py-1.5 rounded-md transition-colors ${page === i + 1 ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-md' : 'bg-white border border-gray-200 text-gray-600'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={16}/></button>
        </div>
      </div>

      {/* Modal de Visualização */}
      {modalOpen && selectedTicket && (
        <Modal onClose={closeModal}>
          {loading ? (
            <div className="p-8 text-center">Carregando...</div>
          ) : (
            <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalhes do Ticket #{selectedTicket.id}</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-gray-600">Título/Descrição:</label>
                  <p className="text-gray-800 bg-gray-50 p-2 rounded">{selectedTicket.descricao}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Cliente:</label>
                  <p className="text-gray-800">{selectedTicket.client || 'Não informado'}</p>
                </div>
                 <div>
                  <label className="font-semibold text-gray-600">Status:</label>
                  <p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusLabel(selectedTicket.status)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Prioridade:</label>
                  <p>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedTicket.urgencia || '')}`}>
                       {selectedTicket.urgencia || 'Não informada'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-gray-600">Atribuído a:</label>
                  <p className="text-gray-800">{selectedTicket.atendidoPor?.nome || 'Não atribuído'}</p>
                </div>
                 <div>
                  <label className="font-semibold text-gray-600">Criado por:</label>
                  <p className="text-gray-800">{selectedTicket.criadoPor?.nome}</p>
                </div>
                 <div>
                  <label className="font-semibold text-gray-600">Criado em:</label>
                  <p className="text-gray-800">{new Date(selectedTicket.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
} 