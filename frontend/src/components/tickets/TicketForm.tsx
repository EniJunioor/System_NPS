import { useState, useEffect, useRef } from 'react';
import { type TicketFormData } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import GradientButton from '../layout/GradientButton';
import RedButton from '../layout/RedButton';
import { api } from '../../services/api';

interface TicketFormProps {
  onSubmit: (data: TicketFormData) => void;
  onCancel: () => void;
  initialData?: TicketFormData;
  isLoading?: boolean;
  onGenerateLink?: (ticketId: string) => void;
}

const TicketForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isLoading = false, 
  onGenerateLink 
}: TicketFormProps) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<TicketFormData>(
    initialData || {
      client: '',
      description: '',
      priority: 'média',
      attendantId: '',
    }
  );

  const [errors, setErrors] = useState<Partial<TicketFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const clientInputRef = useRef<HTMLInputElement>(null);
  const [usuarios, setUsuarios] = useState<Array<{ id: string; name: string; role: string }>>([]);

  useEffect(() => {
    if (clientInputRef.current) {
      clientInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsuarios(response.data);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      }
    };
    fetchUsuarios();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<TicketFormData> = {};

    if (!formData.client.trim()) {
      newErrors.client = 'Nome do cliente é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição do problema é obrigatória';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    if (!formData.attendantId) {
      newErrors.attendantId = 'Responsável pelo chamado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getPriorityColor = (priority: string) => {
    if (isDarkMode) {
      switch (priority) {
        case 'baixa': return 'text-green-400 bg-green-900/20';
        case 'média': return 'text-yellow-400 bg-yellow-900/20';
        case 'alta': return 'text-red-400 bg-red-900/20';
        default: return 'text-gray-400 bg-gray-900/20';
      }
    } else {
      switch (priority) {
        case 'baixa': return 'text-green-600 bg-green-100';
        case 'média': return 'text-yellow-600 bg-yellow-100';
        case 'alta': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    }
  };

  const handleGenerateLink = () => {
    if (onGenerateLink && initialData?.id) {
      onGenerateLink(initialData.id);
      // Simular geração de link
      const mockLink = `http://localhost:5173/evaluate/token-${Date.now()}`;
      setGeneratedLink(mockLink);
    }
  };

  const copyToClipboard = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink);
        // Mostrar feedback de cópia
      } catch (error) {
        console.error('Erro ao copiar link:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cliente */}
      <div>
        <label htmlFor="client" className={`block text-sm font-medium mb-1 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Cliente <span className="text-red-500">*</span>
        </label>
        <input
          ref={clientInputRef}
          type="text"
          id="client"
          value={formData.client}
          onChange={(e) => handleInputChange('client', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
            errors.client ? 'border-red-300' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
          }`}
          placeholder="Digite o nome do cliente"
          aria-describedby={errors.client ? 'client-error' : undefined}
          disabled={isLoading || isSubmitting}
        />
        {errors.client && (
          <p id="client-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.client}
          </p>
        )}
      </div>

      {/* Descrição do Problema */}
      <div>
        <label htmlFor="description" className={`block text-sm font-medium mb-1 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Descrição do Problema <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-vertical transition-colors ${
            errors.description ? 'border-red-300' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
          }`}
          placeholder="Descreva detalhadamente o problema reportado pelo cliente"
          aria-describedby={errors.description ? 'description-error' : undefined}
          disabled={isLoading || isSubmitting}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      {/* Prioridade */}
      <div>
        <label htmlFor="priority" className={`block text-sm font-medium mb-1 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Prioridade
        </label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => handleInputChange('priority', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
            isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
          }`}
          disabled={isLoading || isSubmitting}
        >
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>
        <div className="mt-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
            {formData.priority}
          </span>
        </div>
      </div>

      {/* Responsável pelo Chamado */}
      <div>
        <label htmlFor="attendantId" className={`block text-sm font-medium mb-1 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Responsável pelo Chamado <span className="text-red-500">*</span>
        </label>
        <select
          id="attendantId"
          value={formData.attendantId}
          onChange={(e) => handleInputChange('attendantId', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors ${
            errors.attendantId ? 'border-red-300' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
          }`}
          aria-describedby={errors.attendantId ? 'attendant-error' : undefined}
          disabled={isLoading || isSubmitting}
        >
          <option value="">Selecione um atendente</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
        {errors.attendantId && (
          <p id="attendant-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.attendantId}
          </p>
        )}
      </div>

      {/* Link Gerado */}
      {generatedLink && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Link de Avaliação Gerado</h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm rounded-md"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
            >
              Copiar
            </button>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <GradientButton
          type="submit"
          disabled={isLoading || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Salvar Ticket
        </GradientButton>
        
        {initialData?.id && onGenerateLink && (
          <GradientButton
            type="button"
            onClick={handleGenerateLink}
            disabled={isLoading || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Gerar Link de Avaliação
          </GradientButton>
        )}
        
        <RedButton
          type="button"
          onClick={onCancel}
          disabled={isLoading || isSubmitting}
          className="bg-gray-600 hover:bg-gray-700 text-white"
        >
          Cancelar
        </RedButton>
      </div>
    </form>
  );
};

export default TicketForm; 