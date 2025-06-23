import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import type { Ticket } from '../types';

export default function TicketEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [descricao, setDescricao] = useState('');
  const [priority, setPriority] = useState('baixa');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      ticketService.getTicketById(id).then(t => {
        setTicket(t);
        setDescricao(t.descricao);
        setPriority(t.priority || 'baixa');
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    await ticketService.updateTicket(id, { descricao, priority });
    setSaving(false);
    navigate('/tickets');
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!ticket) return <div className="p-8 text-center text-red-500">Ticket não encontrado.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4">Editar Ticket #{ticket.id}</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Descrição</label>
        <textarea className="w-full border rounded p-2" value={descricao} onChange={e => setDescricao(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Prioridade</label>
        <select className="w-full border rounded p-2" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>
      <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
} 