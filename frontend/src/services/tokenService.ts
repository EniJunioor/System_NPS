import { api } from './api';
import type { Token } from '../types';

export interface TokenFormData {
  telefone: string;
  atendente: string;
  dataAtendimento: string;
}

export interface TokenFilters {
  usado?: boolean;
  atendente?: string;
  dataInicio?: string;
  dataFim?: string;
  expirado?: boolean;
}

export interface TokenStats {
  total: number;
  usados: number;
  naoUsados: number;
  expirados: number;
  porAtendente: {
    [key: string]: number;
  };
}

export interface TokenResponse {
  token: Token;
  message: string;
}

export interface TokensResponse {
  tokens: Token[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const tokenService = {
  // Gerar novo token
  async generateToken(data: TokenFormData): Promise<TokenResponse> {
    const response = await api.post('/tokens', data);
    return response.data;
  },

  // Gerar múltiplos tokens
  async generateMultipleTokens(
    data: TokenFormData[],
    quantidade: number
  ): Promise<{ tokens: Token[]; message: string }> {
    const response = await api.post('/tokens/bulk', { tokens: data, quantidade });
    return response.data;
  },

  // Listar todos os tokens com paginação e filtros
  async getTokens(
    page: number = 1,
    limit: number = 10,
    filters?: TokenFilters
  ): Promise<TokensResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/tokens?${params}`);
    return response.data;
  },

  // Obter token por ID
  async getTokenById(id: string): Promise<Token> {
    const response = await api.get(`/tokens/${id}`);
    return response.data;
  },

  // Obter token por valor
  async getTokenByValue(valor: string): Promise<Token> {
    const response = await api.get(`/tokens/value/${valor}`);
    return response.data;
  },

  // Validar token
  async validateToken(valor: string): Promise<{ valid: boolean; token?: Token; message?: string }> {
    try {
      const response = await api.get(`/tokens/validate/${valor}`);
      return { valid: true, token: response.data };
    } catch (error: any) {
      return { 
        valid: false, 
        message: error.response?.data?.error || 'Token inválido' 
      };
    }
  },

  // Marcar token como usado
  async markTokenAsUsed(id: string): Promise<TokenResponse> {
    const response = await api.patch(`/tokens/${id}/use`);
    return response.data;
  },

  // Deletar token
  async deleteToken(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/tokens/${id}`);
    return response.data;
  },

  // Obter estatísticas dos tokens
  async getTokenStats(filters?: TokenFilters): Promise<TokenStats> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';
    
    const response = await api.get(`/tokens/stats${params ? `?${params}` : ''}`);
    return response.data;
  },

  // Obter tokens do usuário logado
  async getMyTokens(
    page: number = 1,
    limit: number = 10,
    filters?: TokenFilters
  ): Promise<TokensResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/tokens/my-tokens?${params}`);
    return response.data;
  },

  // Buscar tokens por texto
  async searchTokens(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TokensResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/tokens/search?${params}`);
    return response.data;
  },

  // Exportar tokens para CSV
  async exportTokens(filters?: TokenFilters): Promise<Blob> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';

    const response = await api.get(`/tokens/export${params ? `?${params}` : ''}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Obter tokens expirados
  async getExpiredTokens(
    page: number = 1,
    limit: number = 10
  ): Promise<TokensResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/tokens/expired?${params}`);
    return response.data;
  },

  // Limpar tokens expirados
  async cleanExpiredTokens(): Promise<{ message: string; deletedCount: number }> {
    const response = await api.delete('/tokens/clean-expired');
    return response.data;
  },

  // Renovar token (gerar novo token com mesma data de atendimento)
  async renewToken(id: string): Promise<TokenResponse> {
    const response = await api.post(`/tokens/${id}/renew`);
    return response.data;
  },

  // Obter tokens por período
  async getTokensByPeriod(
    dataInicio: string,
    dataFim: string,
    page: number = 1,
    limit: number = 10
  ): Promise<TokensResponse> {
    const params = new URLSearchParams({
      dataInicio,
      dataFim,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/tokens/period?${params}`);
    return response.data;
  },
}; 