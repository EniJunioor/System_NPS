import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import type { Ticket } from '../types';

export default function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ticketService.getTicketById(id).then(setTicket).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!ticket) return <div className="p-8 text-center text-red-500">Ticket não encontrado.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Ticket #{ticket.id}</h1>
      <div className="mb-2"><b>Descrição:</b> {ticket.descricao}</div>
      <div className="mb-2"><b>Status:</b> {ticket.status}</div>
      <div className="mb-2"><b>Prioridade:</b> {ticket.priority || '-'}</div>
      <div className="mb-2"><b>Criado por:</b> {ticket.criadoPor?.nome || '-'}</div>
      <div className="mb-2"><b>Data de criação:</b> {new Date(ticket.createdAt).toLocaleString('pt-BR')}</div>
      <Link to="/tickets" className="inline-block mt-4 text-blue-600 hover:underline">Voltar para lista</Link>
    </div>
  );
} 