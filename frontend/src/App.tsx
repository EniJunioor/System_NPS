import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Tickets from './pages/Tickets';
import TokenGenerator from './pages/TokenGenerator';
import Config from './pages/Config';
import Ajuda from './pages/Ajuda';
import Notificacoes from './pages/Notificacoes';
import Profile from './pages/Profile';
import Api from './pages/Api';
import Chat from './pages/Chat';
import MainLayout from './components/layout/MainLayout';
import { ModalProvider } from './contexts/ModalContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { LoadingOverlay } from './components/layout/LoadingSpinner';
import { useAuthContext } from './contexts/AuthContext';
import NewTicket from './pages/NewTicket';
import NewTask from './pages/NewTask';

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  if (isLoading) {
    return <LoadingOverlay show={true} text="Verificando autenticação..." />;
  }
  
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/tarefas" element={<PrivateRoute><Tasks /></PrivateRoute>} />
            <Route path="/tarefas/nova" element={<PrivateRoute><NewTask /></PrivateRoute>} />
            <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
            <Route path="/tickets/novo" element={<PrivateRoute><NewTicket /></PrivateRoute>} />
            <Route path="/token-generator" element={<PrivateRoute><TokenGenerator /></PrivateRoute>} />
            <Route path="/configuracoes" element={<PrivateRoute><Config /></PrivateRoute>} />
            <Route path="/ajuda" element={<PrivateRoute><Ajuda /></PrivateRoute>} />
            <Route path="/notificacoes" element={<PrivateRoute><Notificacoes /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/api" element={<PrivateRoute><Api /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          </Routes>
        </ModalProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
