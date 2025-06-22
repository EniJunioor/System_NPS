import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Key, 
  Ticket, 
  CheckSquare, 
  MessageCircle, 
  Bell, 
  Settings, 
  HelpCircle, 
  User, 
  Code 
} from 'lucide-react';

const SimpleNav = () => {
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Gerador de Token', icon: Key, path: '/token-generator' },
    { title: 'Tickets', icon: Ticket, path: '/tickets' },
    { title: 'Tarefas', icon: CheckSquare, path: '/tasks' },
    { title: 'Chat', icon: MessageCircle, path: '/chat' },
    { title: 'Notificações', icon: Bell, path: '/notificacoes' },
    { title: 'Configurações', icon: Settings, path: '/configuracoes' },
    { title: 'Ajuda', icon: HelpCircle, path: '/ajuda' },
    { title: 'Perfil', icon: User, path: '/profile' },
    { title: 'API', icon: Code, path: '/api' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-purple-700">NPS System</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-purple-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleNav; 