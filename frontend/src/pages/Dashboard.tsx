import {
  CheckSquare,
  Filter,
  Key,
  MessageCircle,
  Plus,
  Ticket,
  Users
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';

// Componente Net Promoter Score
const NetPromoterScore = ({ score, total }: { score: number, total: number }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="relative">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="15" fill="transparent" className="text-gray-200" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="15"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${getScoreColor()}`}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">{score}</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${getScoreColor().replace('text-', 'bg-')}`}></span>
        <span className={`font-semibold text-base ${getScoreColor()}`}>
          {score >= 70 ? 'Excelente' : score >= 40 ? 'Bom' : 'Precisa Melhorar'}
        </span>
      </div>
      <div className="text-sm text-gray-500 mt-1">Baseado em {total} avaliações</div>
    </div>
  );
};

// Componente Gráfico de Performance
const PerformanceChart = () => {
    const data = [
        { name: 'Jan', value: 400 },
        { name: 'Fev', value: 600 },
        { name: 'Mar', value: 300 },
        { name: 'Abr', value: 800 },
        { name: 'Mai', value: 700 },
        { name: 'Jun', value: 900 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax + 100']} />
                <Tooltip 
                  wrapperClassName="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg" 
                  contentStyle={{ backgroundColor: 'transparent', border: 'none' }}
                  labelStyle={{ color: '#cbd5e1' }}
                  cursor={{fill: 'rgba(147, 51, 234, 0.1)'}} 
                />
                <Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default function Dashboard() {
  const {
    isLoading,
    error,
    stats,
    activities,
    dataInicial,
    setDataInicial,
    dataFinal,
    setDataFinal,
    fetchStats,
    fetchActivities,
    fetchStatsByPeriod,
    atendente,
    setAtendente,
    users,
  } = useDashboard();

  const quickActions = [
    { title: 'Criar Ticket', path: '/tickets', icon: Plus, primary: true },
    { title: 'Gerar Token', path: '/token-generator', icon: Key, primary: false },
    { title: 'Nova Tarefa', path: '/tarefas/nova', icon: CheckSquare, primary: false },
    { title: 'Abrir Chat', path: '/chat', icon: MessageCircle, primary: false },
  ];
  
  useEffect(() => {
    fetchStats();
    fetchActivities();
  }, []);

  const handleFilter = () => {
    if (dataInicial && dataFinal) {
      fetchStatsByPeriod(dataInicial, dataFinal);
      fetchActivities();
    }
  };

  console.log('Usuários para filtro de atendente:', users);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 flex-1">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 items-end">
        <div className="lg:col-span-1">
            <label className="text-sm font-medium text-gray-700">Atendente</label>
            <div className="relative mt-1">
                <select
                  className="w-full pl-3 pr-10 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  value={atendente}
                  onChange={e => setAtendente(e.target.value)}
                >
                  <option value="">Todos os atendentes</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name || user.nome} ({user.role})</option>
                  ))}
                </select>
            </div>
        </div>
        <div>
            <label className="text-sm font-medium text-gray-700">Data Inicial</label>
            <div className="relative mt-1">
                <input
                  type="date"
                  value={dataInicial}
                  onChange={e => setDataInicial(e.target.value)}
                  maxLength={8}
                  className="w-full pl-3 pr-2 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-500 text-sm"
                  style={{ colorScheme: 'light' }}
                />
            </div>
        </div>
        <div>
            <label className="text-sm font-medium text-gray-700">Data Final</label>
            <div className="relative mt-1">
                <input
                  type="date"
                  value={dataFinal}
                  onChange={e => setDataFinal(e.target.value)}
                  maxLength={8}
                  className="w-full pl-3 pr-2 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-500 text-sm"
                  style={{ colorScheme: 'light' }}
                />
            </div>
        </div>
        <div>
            <button
              className="w-full lg:w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all transform hover:scale-105 shadow-sm"
              style={{ backgroundImage: 'linear-gradient(to right, #2563eb, #9333ea)' }}
              onClick={handleFilter}
              disabled={isLoading}
            >
                <Filter size={18}/>
                Filtrar
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {isLoading && <div className="col-span-full text-center text-gray-500 py-4">Carregando...</div>}
        {error && <div className="col-span-full text-center text-red-500 py-4">{error.message}</div>}
        {!isLoading && !error && stats && (
          <>
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:border-purple-300/50">
              <div>
                <p className="text-sm text-gray-500">Total de Tickets</p>
                <p className="text-2xl font-bold text-gray-800">{stats.tickets?.total ?? '-'}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <Ticket className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:border-purple-300/50">
              <div>
                <p className="text-sm text-gray-500">Tarefas Concluídas</p>
                <p className="text-2xl font-bold text-gray-800">{stats.tasks?.concluidas ?? '-'}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <CheckSquare className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:border-purple-300/50">
              <div>
                <p className="text-sm text-gray-500">Tokens Gerados</p>
                <p className="text-2xl font-bold text-gray-800">{stats.tokens?.total ?? '-'}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-100">
                <Key className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200/80 flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:border-purple-300/50">
              <div>
                <p className="text-sm text-gray-500">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-800">{(stats.tickets?.abertos ?? 0) + (stats.tickets?.emAndamento ?? 0)}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200/80 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Net Promoter Score</h2>
          {stats && (
            <NetPromoterScore score={stats.avaliacoes?.npsScore ?? 0} total={stats.avaliacoes?.total ?? 0} />
          )}
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200/80 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance dos Atendimentos</h2>
           <PerformanceChart />
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className={`w-full flex items-center gap-3 p-4 rounded-lg text-left font-medium transition-all duration-300 transform hover:scale-105
                  ${action.primary ? 'bg-purple-600 text-white hover:bg-purple-700 shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                <action.icon size={20}/>
                {action.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h2>
          <ul className="divide-y divide-gray-100">
            {isLoading && <li className="text-center text-gray-500 py-4">Carregando...</li>}
            {error && <li className="text-center text-red-500 py-4">{error.message}</li>}
            {!isLoading && !error && activities && activities.length > 0 && activities.map((activity, idx) => (
              <li key={activity.id || idx} className="flex items-center gap-4 py-3">
                <div className={`p-2 rounded-lg bg-gray-100`}>
                  {activity.type === 'ticket' && <Ticket className="h-5 w-5 text-purple-600" />}
                  {activity.type === 'task' && <CheckSquare className="h-5 w-5 text-green-500" />}
                  {activity.type === 'token' && <Key className="h-5 w-5 text-yellow-500" />}
                  {activity.type === 'avaliacao' && <MessageCircle className="h-5 w-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString('pt-BR')}</span>
              </li>
            ))}
            {!isLoading && !error && activities && activities.length === 0 && (
              <li className="text-center text-gray-400 py-4">Nenhuma atividade recente.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 