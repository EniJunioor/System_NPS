import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Eye, Edit, Package, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const summaryCards = [
  { label: 'Total', value: 248, icon: Package, color: 'text-blue-500 bg-blue-100' },
  { label: 'Pendentes', value: 42, icon: Clock, color: 'text-yellow-500 bg-yellow-100' },
  { label: 'Resolvidos', value: 186, icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
  { label: 'Urgentes', value: 20, icon: AlertCircle, color: 'text-red-500 bg-red-100' },
];

const tickets = [
  {
    id: '#2024-001',
    title: 'Problema com login',
    desc: 'Não consigo acessar minha conta',
    client: { name: 'Ana Silva', email: 'ana@email.com', avatar: 'https://i.pravatar.cc/150?u=ana' },
    status: 'Em andamento',
    statusColor: 'bg-yellow-100 text-yellow-800',
    priority: 'Alta',
    priorityColor: 'bg-red-100 text-red-600',
    created: '15/01/2024',
  },
  {
    id: '#2024-002',
    title: 'Erro na integração',
    desc: 'API retornando erro 500',
    client: { name: 'João Santos', email: 'joao@empresa.com', avatar: 'https://i.pravatar.cc/150?u=joao' },
    status: 'Aberto',
    statusColor: 'bg-blue-100 text-blue-700',
    priority: 'Urgente',
    priorityColor: 'bg-red-500 text-white',
    created: '14/01/2024',
  },
  {
    id: '#2024-003',
    title: 'Solicitação de feature',
    desc: 'Adicionar filtro por data',
    client: { name: 'Maria Costa', email: 'maria@teste.com', avatar: 'https://i.pravatar.cc/150?u=maria' },
    status: 'Resolvido',
    statusColor: 'bg-green-100 text-green-700',
    priority: 'Baixa',
    priorityColor: 'bg-gray-100 text-gray-600',
    created: '13/01/2024',
  },
];

const statusOptions = ['Todos os status', 'Aberto', 'Em andamento', 'Resolvido', 'Urgente'];
const priorityOptions = ['Todas as prioridades', 'Alta', 'Média', 'Baixa', 'Urgente'];

export default function Tickets() {
  const [status, setStatus] = useState('Todos os status');
  const [priority, setPriority] = useState('Todas as prioridades');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(2);

  return (
    <div className="w-full p-6 space-y-6 bg-gray-50/30">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tickets</h1>
          <p className="text-gray-500">Gerencie seus tickets de suporte</p>
        </div>
        <Link to="/tickets/novo">
          <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-md cursor-pointer">
            <Plus size={18} />
            Novo Ticket
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4 border border-gray-100">
            <div className={`p-3 rounded-full ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Buscar tickets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-purple-500 focus:border-purple-500"
        />
        <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-purple-500 focus:border-purple-500">
          {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-md bg-white focus:ring-purple-500 focus:border-purple-500">
          {priorityOptions.map(opt => <option key={opt}>{opt}</option>)}
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
              <th className="px-4 py-3 text-left">TÍTULO</th>
              <th className="px-4 py-3 text-left">CLIENTE</th>
              <th className="px-4 py-3 text-left">STATUS</th>
              <th className="px-4 py-3 text-left">PRIORIDADE</th>
              <th className="px-4 py-3 text-left">CRIADO EM</th>
              <th className="px-4 py-3 text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50/50">
                <td className="px-4 py-3 font-semibold text-gray-700">{ticket.id}</td>
                <td className="px-4 py-3">
                  <div className="font-bold text-gray-800">{ticket.title}</div>
                  <div className="text-gray-500 text-xs">{ticket.desc}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={ticket.client.avatar} alt={ticket.client.name} className="w-9 h-9 rounded-full" />
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{ticket.client.name}</div>
                      <div className="text-xs text-gray-500">{ticket.client.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.statusColor}`}>{ticket.status}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.priorityColor}`}>{ticket.priority}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 font-medium">{ticket.created}</td>
                <td className="px-4 py-3 text-center">
                  <button className="p-2 text-gray-400 hover:text-purple-600"><Eye size={16} /></button>
                  <button className="p-2 text-gray-400 hover:text-purple-600"><Edit size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Mostrando 1 a 10 de 97 resultados</span>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16}/></button>
          <button className="px-3.5 py-1.5 rounded-md transition-colors bg-white border border-gray-200 text-gray-600">1</button>
          <button className="px-3.5 py-1.5 rounded-md transition-colors bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-md">2</button>
          <button className="px-3.5 py-1.5 rounded-md transition-colors bg-white border border-gray-200 text-gray-600">3</button>
          <button className="p-2 rounded-md hover:bg-gray-200"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  );
} 