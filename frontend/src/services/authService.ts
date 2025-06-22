import { api } from './api';
import type { User } from '../types';

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  tipo: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileData {
  nome?: string;
  email?: string;
}

export interface ChangePasswordData {
  senhaAtual: string;
  novaSenha: string;
}

export const authService = {
  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Obter perfil do usuário
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Atualizar perfil
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Alterar senha
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  // Listar usuários (apenas admin)
  async getUsers(): Promise<User[]> {
    const response = await api.get('/auth/users');
    return response.data;
  },

  // Deletar usuário (apenas admin)
  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  },

  // Verificar se o token é válido
  async validateToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await api.get('/auth/validate');
      return { valid: true, user: response.data };
    } catch (error) {
      return { valid: false };
    }
  },
}; 