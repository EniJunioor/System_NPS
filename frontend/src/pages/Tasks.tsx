import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, List, LayoutGrid, Check, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

const summaryCards = [
  { label: 'Total de Tarefas', value: 24, icon: List, color: 'text-blue-500 bg-blue-100' },
  { label: 'Em Progresso', value: 8, icon: Clock, color: 'text-yellow-500 bg-yellow-100' },
  { label: 'Concluídas', value: 12, icon: CheckCircle2, color: 'text-green-500 bg-green-100' },
  { label: 'Atrasadas', value: 4, icon: AlertOctagon, color: 'text-red-500 bg-red-100' },
];

const tasks = [
    {
        id: 1,
        title: 'Implementar autenticação JWT',
        description: 'Configurar sistema de autenticação com tokens JWT',
        status: 'Em progresso',
        statusColor: 'text-yellow-800 bg-yellow-100',
        priority: 'Alta prioridade',
        priorityColor: 'text-red-800 bg-red-100',
        dueDate: '25/12/2024',
        completed: false,
        assignees: ['https://i.pravatar.cc/150?u=a', 'https://i.pravatar.cc/150?u=b']
    },
    {
        id: 2,
        title: 'Configurar banco de dados',
        description: 'Setup inicial do PostgreSQL',
        status: 'Concluída',
        statusColor: 'text-green-800 bg-green-100',
        priority: 'Média prioridade',
        priorityColor: 'text-blue-800 bg-blue-100',
        completedDate: '20/12/2024',
        completed: true,
        assignees: ['https://i.pravatar.cc/150?u=c']
    },
    {
        id: 3,
        title: 'Criar interface de usuário',
        description: 'Desenvolver componentes React com TypeScript',
        status: 'Pendente',
        statusColor: 'text-gray-800 bg-gray-200',
        priority: 'Baixa prioridade',
        priorityColor: 'text-gray-800 bg-gray-100',
        dueDate: '30/12/2024',
        completed: false,
        assignees: ['https://i.pravatar.cc/150?u=d', 'https://i.pravatar.cc/150?u=e']
    }
];

export default function Tasks() {
  const [viewMode, setViewMode] = useState('list');

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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Buscar tarefas..." className="w-full pl-10 pr-4 py-2 border rounded-md bg-white focus:ring-purple-500 focus:border-purple-500"/>
        </div>
        <select className="px-4 py-2 border rounded-md bg-white w-full md:w-auto">
          <option>Todos os status</option>
        </select>
        <select className="px-4 py-2 border rounded-md bg-white w-full md:w-auto">
          <option>Todas as prioridades</option>
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

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Tarefas</h2>
        {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex-shrink-0">
                    <button className={`w-6 h-6 rounded border flex items-center justify-center ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300 bg-white'}`}>
                        {task.completed && <Check size={16} className="text-white" />}
                    </button>
                </div>
                <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${task.statusColor}`}>{task.status}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${task.priorityColor}`}>{task.priority}</span>
                </div>
                <div className="text-sm text-gray-500 w-40 text-right flex-shrink-0">
                    {task.completed ? `Concluída em: ${task.completedDate}` : `Prazo: ${task.dueDate}`}
                </div>
                <div className="flex -space-x-2 ml-4 flex-shrink-0">
                    {task.assignees.map((assignee, index) => (
                        <img key={index} src={assignee} alt="Assignee" className="w-8 h-8 rounded-full border-2 border-white" />
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
} 