export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: string;
}

export interface Task {
  id: string;
  descricao: string;
  duracao: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA';
  tag: 'TREINAMENTO' | 'IMPLANTACAO' | 'SUPORTE_TECNICO' | 'DESENVOLVIMENTO' | 'MANUTENCAO';
  sistema?: 'CONTROLID' | 'TIME_PRO' | 'BINARTECH' | 'AHGORA' | 'SIMPAX';
  criadoPor: User;
  responsavel?: User;
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
}

export interface TaskFormData {
  duracao: string;
  descricao: string;
  tag: 'TREINAMENTO' | 'IMPLANTACAO' | 'SUPORTE_TECNICO' | 'DESENVOLVIMENTO' | 'MANUTENCAO';
  sistema?: 'CONTROLID' | 'TIME_PRO' | 'BINARTECH' | 'AHGORA' | 'SIMPAX';
  responsavelId: string;
  videoUrl: string;
}

export interface Ticket {
  id: string;
  descricao: string;
  data: string;
  hora: string;
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
  criadoPor: User;
  atendidoPor?: User;
  createdAt: string;
  updatedAt: string;
  priority?: string;
  client?: string;
}

export interface TicketFormData {
  client: string;
  description: string;
  priority: 'baixa' | 'média' | 'alta';
  attendantId: string;
  id?: string;
}

export interface Avaliacao {
  id: string;
  sistema: number;
  atendimento: number;
  token: string;
  createdAt: string;
}

export interface Token {
  id: string;
  valor: string;
  telefone: string;
  atendente: string;
  dataAtendimento: string;
  expiraEm: string;
  usado: boolean;
  createdAt: string;
} 