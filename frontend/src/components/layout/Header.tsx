import { Bell, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useNotificationContext } from '../../contexts/NotificationContext';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthContext();
  const { notifications, unreadCount, marcarComoLida } = useNotificationContext();

  // Fecha o modal ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <header className="flex justify-end items-center p-4 sm:p-6 bg-gray-50/50 border-b border-gray-200/80">
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 rounded-full hover:bg-gray-200/70 transition-colors">
          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
        </button>
        <div className="relative">
          <button
            className="relative p-2 rounded-full hover:bg-gray-200/70 transition-colors"
            onClick={() => setShowNotifications((v) => !v)}
            aria-label="Abrir notificações"
          >
            <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </button>
          {showNotifications && (
            <div ref={notifRef} className="absolute right-0 mt-2 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-y-auto animate-fade-in">
              <div className="p-4 border-b font-bold text-gray-700 flex justify-between items-center">
                Notificações
                <span className="text-xs font-normal text-gray-400">{unreadCount} não lidas</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {notifications.slice(0, 6).map((n) => (
                  <li key={n.id} className={`p-4 flex gap-3 items-start ${n.unread ? 'bg-purple-50' : ''}`}>
                    <span className="mt-1">{n.type === 'system' ? '⚠️' : n.type === 'ticket' ? '🎫' : n.type === 'task' ? '✅' : n.type === 'user' ? '👤' : '📊'}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 text-sm">{n.title}</div>
                      <div className="text-xs text-gray-500">{n.description}</div>
                      <div className="text-[11px] text-gray-400 mt-1">{n.time}</div>
                      {n.unread && (
                        <button
                          className="text-xs text-purple-600 hover:underline font-medium mt-1"
                          onClick={() => marcarComoLida(n.id)}
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                {notifications.length === 0 && (
                  <li className="p-4 text-center text-gray-400">Sem notificações</li>
                )}
              </ul>
              <div className="p-2 border-t text-center">
                <Link
                  to="/notificacoes"
                  className="text-xs text-purple-600 hover:underline font-medium"
                  onClick={() => setShowNotifications(false)}
                >
                  Ver todas
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold overflow-hidden">
          {user && user.foto ? (
            <img src={user.foto} alt={user.nome} className="w-full h-full object-cover rounded-full" />
          ) : (
            user && user.nome ? (
              user.nome.split(' ').slice(0,2).map((n: string) => n[0]).join('').toUpperCase()
            ) : (
              'US'
            )
          )}
        </div>
      </div>
    </header>
  );
} 