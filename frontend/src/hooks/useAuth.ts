import { useState, useEffect } from 'react';
import { authService, type LoginData, type RegisterData } from '../services';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Verificar se há dados de autenticação no localStorage
    const token = localStorage.getItem('@AvaNPS:token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Validar token no servidor
        validateTokenOnServer(token);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        // Limpar dados inválidos
        clearAuthData();
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const validateTokenOnServer = async (token: string) => {
    try {
      const { valid, user } = await authService.validateToken();
      if (!valid) {
        clearAuthData();
      } else if (user) {
        // Atualizar dados do usuário se necessário
        setAuthState(prev => ({
          ...prev,
          user,
          isLoading: false,
        }));
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Erro ao validar token:', error);
      clearAuthData();
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('@AvaNPS:token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const login = async (data: LoginData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { user, token } = await authService.login(data);
      
      localStorage.setItem('@AvaNPS:token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro no login' 
      };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { user, token } = await authService.register(data);
      
      localStorage.setItem('@AvaNPS:token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro no registro' 
      };
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao atualizar perfil' 
      };
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState(prev => ({
        ...prev,
        user,
      }));
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  return {
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };
}; 