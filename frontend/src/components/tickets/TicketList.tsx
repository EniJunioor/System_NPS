import { useState, useContext } from 'react';
import type { Ticket } from '../../types';
import { ThemeContext } from '../../contexts/ThemeContext';
import Chip from '../layout/Chip';
import GradientButton from '../layout/GradientButton';
import RedButton from '../layout/RedButton';
import { useAuth } from '../../hooks/useAuth';

interface TicketListProps {
  tickets: Ticket[];
  onEdit: (ticketId: string) => void;
  onDelete: (ticketId: string) => void;
  onTransfer: (ticketId: string, atendidoPorId: string) => void;
  onClose: (ticketId: string) => void;
  attendants: Array<{ id: string; name: string; role: string }>;
  onGenerateLink: (ticket: Ticket) => void;
  onSendLink: (ticket: Ticket) => void;
}

const TicketList = ({ tickets, onEdit, onDelete, onTransfer, onClose, attendants, onGenerateLink, onSendLink }: TicketListProps) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'AGUARDANDO_ATENDIMENTO' | 'AGUARDANDO_CLIENTE'>('todos');
  const [filterPriority, setFilterPriority] = useState<'todas' | 'baixa' | 'média' | 'alta'>('todas');
  const [transferTicketId, setTransferTicketId] = useState<string | null>(null);
  const [selectedAttendant, setSelectedAttendant] = useState<string>('');

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'todos' || ticket.status === filterStatus;
    const priorityMatch = filterPriority === 'todas' || ticket.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ABERTO': return 'blue';
      case 'EM_ANDAMENTO': return 'yellow';
      case 'FINALIZADO': return 'green';
      case 'AGUARDANDO_ATENDIMENTO': return 'yellow';
      case 'AGUARDANDO_CLIENTE': return 'yellow';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'baixa': return 'green';
      case 'média': return 'yellow';
      case 'alta': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ABERTO': return 'Aberto';
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'FINALIZADO': return 'Finalizado';
      case 'AGUARDANDO_ATENDIMENTO': return 'Aguardando Atendimento';
      case 'AGUARDANDO_CLIENTE': return 'Aguardando Cliente';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className={`p-4 rounded-lg shadow-sm border transition-colors ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <h2 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Filtros
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="statusFilter" className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Status
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
                isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
              }`}
            >
              <option value="todos">Todos os Status</option>
              <option value="ABERTO">Aberto</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="AGUARDANDO_ATENDIMENTO">Aguardando Atendimento</option>
              <option value="AGUARDANDO_CLIENTE">Aguardando Cliente</option>
            </select>
          </div>

          <div>
            <label htmlFor="priorityFilter" className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Prioridade
            </label>
            <select
              id="priorityFilter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as typeof filterPriority)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
                isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
              }`}
            >
              <option value="todas">Todas as Prioridades</option>
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="flex items-end">
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} encontrado{filteredTickets.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Tickets */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <svg className={`mx-auto h-12 w-12 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className={`mt-2 text-sm font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Nenhum ticket encontrado
          </h3>
          <p className={`mt-1 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {tickets.length === 0 ? 'Comece criando um novo ticket.' : 'Tente ajustar os filtros.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-6">
                {/* Header do Ticket */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      #{ticket.id}
                    </h3>
                    <Chip color={getStatusColor(ticket.status)}>
                      {getStatusLabel(ticket.status)}
                    </Chip>
                    <Chip color={getPriorityColor(ticket.priority || '')}>
                      {ticket.priority || ''}
                    </Chip>
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Criado em {formatDate(ticket.createdAt)}
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div className="mb-4">
                  <h4 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Cliente
                  </h4>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {ticket.client}
                  </p>
                </div>

                {/* Descrição */}
                <div className="mb-4">
                  <h4 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Descrição
                  </h4>
                  <p className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {truncateText(ticket.description || '')}
                  </p>
                </div>

                {/* Responsável */}
                <div className="mb-4">
                  <h4 className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Responsável
                  </h4>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {ticket.attendantName}
                  </p>
                </div>

                {/* Ações */}
                <div className={`flex flex-wrap gap-2 pt-4 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <GradientButton
                    onClick={() => onEdit(ticket.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </GradientButton>

                  {/* Botão Gerar Link de Avaliação */}
                  <GradientButton
                    onClick={() => onGenerateLink(ticket)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1v4h-1" />
                    </svg>
                    Gerar Link de Avaliação
                  </GradientButton>

                  {/* Botão Enviar Link */}
                  <GradientButton
                    onClick={() => onSendLink(ticket)}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Enviar Link
                  </GradientButton>

                  {ticket.status !== 'FINALIZADO' && (
                    <>
                      {/* Botão Transferir */}
                      {(user?.tipo === 'ADMIN' || user?.tipo === 'GESTOR' || ticket.attendantId === user?.id) && (
                        <div className="mb-2">
                          {transferTicketId === ticket.id ? (
                            <div className="flex flex-col gap-2">
                              <select
                                value={selectedAttendant}
                                onChange={e => setSelectedAttendant(e.target.value)}
                                className={`px-2 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
                              >
                                <option value="">Selecione o novo atendente</option>
                                {attendants.map(a => (
                                  <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                                ))}
                              </select>
                              <div className="flex gap-2">
                                <GradientButton
                                  onClick={() => { onTransfer(ticket.id, selectedAttendant); setTransferTicketId(null); setSelectedAttendant(''); }}
                                  disabled={!selectedAttendant}
                                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2"
                                >
                                  🔄 Confirmar
                                </GradientButton>
                                <RedButton
                                  onClick={() => { setTransferTicketId(null); setSelectedAttendant(''); }}
                                  className="text-xs sm:text-sm px-2 sm:px-3 py-2"
                                >
                                  Cancelar
                                </RedButton>
                              </div>
                            </div>
                          ) : (
                            <GradientButton
                              onClick={() => setTransferTicketId(ticket.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-2"
                            >
                              🔄 Transferir
                            </GradientButton>
                          )}
                        </div>
                      )}
                      <GradientButton
                        onClick={() => onClose(ticket.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Encerrar
                      </GradientButton>
                    </>
                  )}

                  <RedButton
                    onClick={() => onDelete(ticket.id)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </RedButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList; 