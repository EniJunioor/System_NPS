import { api } from './api';
import type { Avaliacao, Token } from '../types';

export interface AvaliacaoData {
  sistema: number;
  atendimento: number;
  token: string;
}

export interface AvaliacaoStats {
  total: number;
  mediaSistema: number;
  mediaAtendimento: number;
  npsScore: number;
  porNota: {
    [key: number]: number;
  };
  porPeriodo: {
    data: string;
    total: number;
    mediaSistema: number;
    mediaAtendimento: number;
  }[];
}

export interface AvaliacaoResponse {
  avaliacao: Avaliacao;
  message: string;
}

export interface AvaliacoesResponse {
  avaliacoes: Avaliacao[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TokenData {
  telefone: string;
  atendente: string;
  dataAtendimento: string;
}

export const avaliacaoService = {
  // Criar nova avaliação
  async createAvaliacao(data: AvaliacaoData): Promise<AvaliacaoResponse> {
    const response = await api.post('/avaliacoes', data);
    return response.data;
  },

  // Listar todas as avaliações com paginação
  async getAvaliacoes(
    page: number = 1,
    limit: number = 10,
    filters?: {
      dataInicio?: string;
      dataFim?: string;
      notaMinima?: number;
      notaMaxima?: number;
    }
  ): Promise<AvaliacoesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters && Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ))
    });

    const response = await api.get(`/avaliacoes?${params}`);
    return response.data;
  },

  // Obter avaliação por ID
  async getAvaliacaoById(id: string): Promise<Avaliacao> {
    const response = await api.get(`/avaliacoes/${id}`);
    return response.data;
  },

  // Validar token de avaliação
  async validateToken(token: string): Promise<{ valid: boolean; token?: Token }> {
    try {
      const response = await api.get(`/avaliacoes/validate-token/${token}`);
      return { valid: true, token: response.data };
    } catch (error) {
      return { valid: false };
    }
  },

  // Obter estatísticas das avaliações
  async getAvaliacaoStats(filters?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<AvaliacaoStats> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';
    
    const response = await api.get(`/avaliacoes/stats${params ? `?${params}` : ''}`);
    return response.data;
  },

  // Exportar avaliações para CSV
  async exportAvaliacoes(filters?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<Blob> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';

    const response = await api.get(`/avaliacoes/export${params ? `?${params}` : ''}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Obter avaliações por período
  async getAvaliacoesByPeriod(
    dataInicio: string,
    dataFim: string,
    page: number = 1,
    limit: number = 10
  ): Promise<AvaliacoesResponse> {
    const params = new URLSearchParams({
      dataInicio,
      dataFim,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/avaliacoes/period?${params}`);
    return response.data;
  },

  // Obter avaliações por nota
  async getAvaliacoesByScore(
    notaMinima: number,
    notaMaxima: number,
    page: number = 1,
    limit: number = 10
  ): Promise<AvaliacoesResponse> {
    const params = new URLSearchParams({
      notaMinima: notaMinima.toString(),
      notaMaxima: notaMaxima.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/avaliacoes/score?${params}`);
    return response.data;
  },

  // Gerar relatório NPS
  async generateNPSReport(filters?: {
    dataInicio?: string;
    dataFim?: string;
  }): Promise<{
    npsScore: number;
    promotores: number;
    passivos: number;
    detratores: number;
    total: number;
    detalhamento: {
      sistema: {
        media: number;
        distribuicao: { [key: number]: number };
      };
      atendimento: {
        media: number;
        distribuicao: { [key: number]: number };
      };
    };
  }> {
    const params = filters ? new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    ) : '';

    const response = await api.get(`/avaliacoes/nps-report${params ? `?${params}` : ''}`);
    return response.data;
  },
}; 