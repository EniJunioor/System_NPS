import React, { createContext, useContext, useState } from 'react';

export type NotificationType = 'system' | 'ticket' | 'task' | 'user' | 'report';

export interface Notification {
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

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  marcarComoLida: (id: number) => void;
  marcarTodasComoLidas: () => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const marcarComoLida = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const marcarTodasComoLidas = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, marcarComoLida, marcarTodasComoLidas, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext deve ser usado dentro de um NotificationProvider');
  }
  return context;
}; 