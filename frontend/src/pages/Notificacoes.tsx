import React, { useState } from 'react';
import { AlertTriangle, Ticket, CheckCircle, UserPlus, BarChart2, Check, ChevronLeft, ChevronRight } from 'lucide-react';

type NotificationType = 'system' | 'ticket' | 'task' | 'user' | 'report';

const notificationIcons: Record<NotificationType, React.ReactElement> = {
  system: <AlertTriangle className="text-red-500" />,
  ticket: <Ticket className="text-blue-500" />,
  task: <CheckCircle className="text-green-500" />,
  user: <UserPlus className="text-gray-500" />,
  report: <BarChart2 className="text-purple-500" />,
};

interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    unread: boolean;
    tags: string[];
}

const initialNotifications: Notification[] = [
    { id: 1, type: 'system', title: 'Sistema em Manutenção', description: 'O sistema entrará em manutenção programada às 23:00 hoje. Duração estimada: 2 horas.', time: '2 min atrás', unread: true, tags: ['Sistema'] },
    { id: 2, type: 'ticket', title: 'Novo Ticket Atribuído', description: 'Ticket #2847 foi atribuído para você. Prioridade: Alta', time: '15 min atrás', unread: true, tags: ['Ticket', 'Ver ticket'] },
    { id: 3, type: 'task', title: 'Tarefa Concluída', description: 'A tarefa "Implementar autenticação JWT" foi marcada como concluída por João Santos.', time: '1 hora atrás', unread: false, tags: ['Tarefa', 'Ver detalhes'] },
    { id: 4, type: 'user', title: 'Novo Usuário Cadastrado', description: 'Carlos Oliveira se cadastrou na plataforma e aguarda aprovação.', time: '3 horas atrás', unread: true, tags: ['Sistema'] },
    { id: 5, type: 'report', title: 'Relatório Mensal Disponível', description: 'O relatório de performance de novembro está disponível para download.', time: '1 dia atrás', unread: false, tags: ['Relatório', 'Download'] },
    { id: 6, type: 'ticket', title: 'Ticket #2845 Atualizado', description: 'O cliente respondeu ao seu ticket sobre o problema de login.', time: '2 dias atrás', unread: false, tags: ['Ticket', 'Ver ticket'] },
    { id: 7, type: 'system', title: 'Atualização de Segurança', description: 'Uma nova política de senhas será implementada amanhã.', time: '3 dias atrás', unread: false, tags: ['Sistema'] },
    { id: 8, type: 'task', title: 'Nova Tarefa: Corrigir Bug', description: 'Uma nova tarefa de alta prioridade foi atribuída a você.', time: '4 dias atrás', unread: false, tags: ['Tarefa', 'Ver detalhes'] },
];

interface FilterButtonProps {
    children: React.ReactNode;
    count: number;
    active: boolean;
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ children, count, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            active
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-purple-50'
        }`}
    >
        {children} <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${active ? 'bg-purple-200' : 'bg-gray-200'}`}>{count}</span>
    </button>
);

export default function Notificacoes() {
    const [filter, setFilter] = useState('Todas');
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 6;
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [modal, setModal] = useState<{ open: boolean, notification?: Notification } | null>(null);

    const getFilteredNotifications = () => {
        switch (filter) {
            case 'Não lidas':
                return notifications.filter(n => n.unread);
            case 'Sistema':
                return notifications.filter(n => n.type === 'system');
            case 'Tickets':
                return notifications.filter(n => n.type === 'ticket');
            default:
                return notifications;
        }
    };
    
    const filteredNotifications = getFilteredNotifications();

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification);
    
    const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const getCount = (type: string) => {
        if (type === 'Todas') return notifications.length;
        if (type === 'Não lidas') return notifications.filter(n => n.unread).length;
        return notifications.filter(n => n.type.toLowerCase() === type.toLowerCase().slice(0, -1)).length;
    }

    // Marcar como lida individual
    const marcarComoLida = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    // Marcar todas como lidas
    const marcarTodasComoLidas = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    // Abrir modal de detalhes
    const verDetalhes = (notification: Notification) => {
        setModal({ open: true, notification });
    };

    // Fechar modal
    const fecharModal = () => setModal(null);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Notificações</h1>
                    <p className="text-gray-500">Gerencie suas notificações e alertas</p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all transform hover:scale-105 shadow-sm text-sm font-medium"
                      onClick={marcarTodasComoLidas}
                    >
                        <Check size={16}/> Marcar todas como lidas
                    </button>
                    <img src="https://i.pravatar.cc/150?u=maria" alt="Maria Silva" className="w-9 h-9 rounded-full" />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 mb-6">
                <FilterButton onClick={() => setFilter('Todas')} active={filter === 'Todas'} count={getCount('Todas')}>Todas</FilterButton>
                <FilterButton onClick={() => setFilter('Não lidas')} active={filter === 'Não lidas'} count={getCount('Não lidas')}>Não lidas</FilterButton>
                <FilterButton onClick={() => setFilter('Sistema')} active={filter === 'Sistema'} count={getCount('Sistema')}>Sistema</FilterButton>
                <FilterButton onClick={() => setFilter('Tickets')} active={filter === 'Tickets'} count={getCount('Tickets')}>Tickets</FilterButton>
            </div>

            {/* Notifications List */}
            <div className="flex-grow space-y-4">
                {currentNotifications.map(notification => (
                    <div key={notification.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-start gap-4 hover:shadow-md transition-shadow duration-300">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.unread ? `bg-${notification.type === 'system' ? 'red' : 'blue'}-100` : 'bg-gray-100'}`}>
                           {notificationIcons[notification.type]}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                            <div className="mt-2 flex items-center gap-4 text-sm">
                                {notification.tags.map(tag => {
                                    const isAction = ['Ver ticket', 'Ver detalhes', 'Download', 'Marcar como lida'].includes(tag);
                                    const isTag = ['Sistema', 'Ticket', 'Tarefa', 'Relatório'].includes(tag);

                                    if (tag === 'Ver detalhes') return (
                                        <button key={tag} className="text-purple-600 hover:underline font-medium" onClick={() => verDetalhes(notification)}>
                                            {tag}
                                        </button>
                                    );
                                    if (tag === 'Ver ticket') return (
                                        <button key={tag} className="text-purple-600 hover:underline font-medium" onClick={() => verDetalhes(notification)}>
                                            {tag}
                                        </button>
                                    );
                                    if (isAction) return <button key={tag} className="text-purple-600 hover:underline font-medium">{tag}</button>;
                                    if (isTag) return <span key={tag} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">{tag}</span>;
                                    return null;
                                })}
                                {notification.unread && (
                                    <button className="text-purple-600 hover:underline font-medium" onClick={() => marcarComoLida(notification.id)}>
                                        Marcar como lida
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${notification.unread ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                {notification.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                <p>Mostrando {indexOfFirstNotification + 1}-{Math.min(indexOfLastNotification, filteredNotifications.length)} de {filteredNotifications.length} notificações</p>
                <div className="flex items-center gap-1">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                            key={page} 
                            onClick={() => handlePageChange(page)}
                            className={`px-3.5 py-1.5 rounded-md transition-colors ${currentPage === page ? 'bg-purple-600 text-white' : 'text-purple-600 hover:bg-purple-50'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Modal de detalhes */}
            {modal?.open && (
                <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center backdrop-blur-md transition-opacity duration-300 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Detalhes da Notificação</h2>
                        <div className="text-gray-600 mb-6">
                            <strong>{modal.notification?.title}</strong>
                            <p className="mt-2">{modal.notification?.description}</p>
                            <p className="mt-2 text-xs text-gray-400">{modal.notification?.time}</p>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={fecharModal}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 