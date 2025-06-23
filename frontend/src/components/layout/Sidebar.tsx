import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Code } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useNotificationContext } from "../../contexts/NotificationContext";

// Ícones SVG inline para evitar dependências externas
const icons = {
  KeyRound: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  ),
  Ticket: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m4 0V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10m16 0a2 2 0 01-2 2H7a2 2 0 01-2-2"
      />
    </svg>
  ),
  CheckSquare: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  LayoutDashboard: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"
      />
    </svg>
  ),
  User: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
      />
    </svg>
  ),
  LogOut: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7"
      />
    </svg>
  ),
  Sun: (
    <svg
      className="w-5 h-5 text-yellow-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 7a5 5 0 000 10a5 5 0 000-10z"
      />
    </svg>
  ),
  Moon: (
    <svg
      className="w-5 h-5 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
      />
    </svg>
  ),
  Menu: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  X: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  Chat: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2h2m4-4h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6a2 2 0 012-2z"
      />
    </svg>
  ),
  Notificacoes: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  Configuracoes: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-1.14 1.603-1.14 1.902 0a1.724 1.724 0 002.573 1.01c.943-.545 2.042.454 1.497 1.398a1.724 1.724 0 001.01 2.573c1.14.3 1.14 1.603 0 1.902a1.724 1.724 0 00-1.01 2.573c.545.943-.454 2.042-1.398 1.497a1.724 1.724 0 00-2.573 1.01c-.3 1.14-1.603 1.14-1.902 0a1.724 1.724 0 00-2.573-1.01c-.943.545-2.042-.454-1.497-1.398a1.724 1.724 0 00-1.01-2.573c-1.14-.3-1.14-1.603 0-1.902a1.724 1.724 0 001.01-2.573c-.545-.943.454-2.042 1.398-1.497.943.545 2.042-.454 1.497-1.398z"
      />
    </svg>
  ),
  Ajuda: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 10h.01M12 14v.01M12 10a4 4 0 10-4 4h.01M12 10a4 4 0 014 4h-.01M12 18h.01"
      />
    </svg>
  ),
  Perfil: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 14a4 4 0 10-8 0m8 0a4 4 0 01-8 0m8 0v1a4 4 0 01-4 4H8a4 4 0 01-4-4v-1a4 4 0 014-4h8a4 4 0 014 4v1a4 4 0 01-4 4h-4a4 4 0 01-4-4v-1"
      />
    </svg>
  ),
};

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthContext();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { unreadCount } = useNotificationContext();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      logout();
    }
  };

  const menuItems = [
    { title: "Dashboard", icon: icons.LayoutDashboard, path: "/dashboard" },
    {
      title: "Gerador de Token",
      icon: icons.KeyRound,
      path: "/token-generator",
    },
    { title: "Tickets", icon: icons.Ticket, path: "/tickets" },
    { title: "Tarefas", icon: icons.CheckSquare, path: "/tarefas" },
    { title: "Chat", icon: icons.Chat, path: "/chat" },
    {
      title: "Notificações",
      icon: icons.Notificacoes,
      path: "/notificacoes",
      badge: unreadCount,
    },
    {
      title: "Configurações",
      icon: icons.Configuracoes,
      path: "/configuracoes",
    },
    { title: "Ajuda", icon: icons.Ajuda, path: "/ajuda" },
    { title: "Perfil", icon: icons.Perfil, path: "/profile" },
    { title: "API", icon: <Code className="w-5 h-5" />, path: "/api" },
  ];

  const systemIcon = (
    <svg
      className="w-7 h-7 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2M16 11V7a4 4 0 00-8 0v4M5 17h14"
      />
    </svg>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg border transition-colors r ${
          isDarkMode
            ? "bg-gray-800 border-gray-600 text-white"
            : "bg-white border-gray-200 text-gray-700"
        } lg:hidden`}
        aria-label="Abrir menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
        fixed top-0 left-0 h-screen w-64
        border-r rounded-r-3xl transform transition-all duration-300 ease-in-out z-40
        flex flex-col shadow-lg
        ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div
          className={`p-6 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-6">
            {systemIcon}
            <span
              className={`text-xl font-bold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              NPS system
            </span>
          </div>
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Sistema de Avaliação
          </p>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
                  ${
                    isDarkMode
                      ? `hover:bg-gray-700 hover:text-white ${
                          location.pathname === item.path
                            ? "bg-blue-600 text-white border-r-2 border-blue-400"
                            : "text-gray-300 hover:translate-x-1"
                        }`
                      : `hover:bg-purple-50 hover:text-purple-700 ${
                          location.pathname === item.path
                            ? "bg-purple-100 text-purple-700 border-r-2 border-purple-600"
                            : "text-gray-700 hover:translate-x-1"
                        }`
                  }
                `}
              >
                <div
                  className={`
                  ${
                    location.pathname === item.path
                      ? isDarkMode
                        ? "text-white"
                        : "text-purple-600"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }
                `}
                >
                  {item.icon}
                </div>
                <span className="ml-3 font-medium flex-1">{item.title}</span>
                {item.badge && item.badge > 0 && (
                  <span
                    className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                      isDarkMode
                        ? "bg-blue-500 text-white"
                        : "bg-purple-500 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        <div
          className={`border-t p-4 space-y-2 ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <button
            onClick={toggleTheme}
            className={`
              flex items-center px-4 py-3 w-full transition-all duration-200 ease-in-out
              rounded-lg hover:translate-x-1
              ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-500" />
            )}
            <span className="ml-3 font-medium">
              {isDarkMode ? "Modo Claro" : "Modo Escuro"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className={`
              flex items-center px-4 py-3 w-full transition-all duration-200 ease-in-out
              rounded-lg hover:translate-x-1
              ${
                isDarkMode
                  ? "text-gray-300 hover:bg-red-900/30 hover:text-red-400"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-600"
              }
            `}
          >
            <LogOut
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <span className="ml-3 font-medium">Sair</span>
          </button>
        </div>
      </div>

      <div className="hidden lg:block w-64" />
    </>
  );
};

export default Sidebar;
