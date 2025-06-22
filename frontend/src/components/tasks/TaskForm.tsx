import { useState, useEffect, useRef } from 'react';
import { type TaskFormData } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import GradientButton from '../layout/GradientButton';
import RedButton from '../layout/RedButton';
;

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: TaskFormData;
  isLoading?: boolean;
  users: Array<{ id: string; name: string; role: string }>;
}

const TaskForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isLoading = false, 
  users
}: TaskFormProps) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<TaskFormData>(
    initialData || {
      duracao: '',
      descricao: '',
      tag: 'SUPORTE_TECNICO',
      sistema: undefined,
      responsavelId: '',
      videoUrl: '',
    }
  );

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const duracaoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (duracaoInputRef.current) {
      duracaoInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setCharCount(formData.descricao.length);
  }, [formData.descricao]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};

    if (!formData.duracao.trim()) {
      newErrors.duracao = 'Duração é obrigatória';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.trim().length < 10) {
      newErrors.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }

    // Validação do campo de vídeo
    if ((formData.tag === 'IMPLANTACAO' || formData.tag === 'TREINAMENTO') && formData.videoUrl) {
      try {
        // Se preenchido, deve ser uma URL válida
        new URL(formData.videoUrl);
      } catch {
        newErrors.videoUrl = 'Informe uma URL válida para o vídeo';
      }
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
      console.error('Erro ao salvar tarefa:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getTagColor = (tag: string) => {
    if (isDarkMode) {
      switch (tag) {
        case 'TREINAMENTO': return 'text-blue-400 bg-blue-900/20';
        case 'IMPLANTACAO': return 'text-green-400 bg-green-900/20';
        case 'SUPORTE_TECNICO': return 'text-yellow-400 bg-yellow-900/20';
        case 'DESENVOLVIMENTO': return 'text-purple-400 bg-purple-900/20';
        case 'MANUTENCAO': return 'text-orange-400 bg-orange-900/20';
        default: return 'text-gray-400 bg-gray-900/20';
      }
    } else {
      switch (tag) {
        case 'TREINAMENTO': return 'text-blue-600 bg-blue-100';
        case 'IMPLANTACAO': return 'text-green-600 bg-green-100';
        case 'SUPORTE_TECNICO': return 'text-yellow-600 bg-yellow-100';
        case 'DESENVOLVIMENTO': return 'text-purple-600 bg-purple-100';
        case 'MANUTENCAO': return 'text-orange-600 bg-orange-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    }
  };

  const getSistemaColor = (sistema: string) => {
    if (isDarkMode) {
      switch (sistema) {
        case 'CONTROLID': return 'text-red-400 bg-red-900/20';
        case 'TIME_PRO': return 'text-blue-400 bg-blue-900/20';
        case 'BINARTECH': return 'text-green-400 bg-green-900/20';
        case 'AHGORA': return 'text-purple-400 bg-purple-900/20';
        case 'SIMPAX': return 'text-orange-400 bg-orange-900/20';
        default: return 'text-gray-400 bg-gray-900/20';
      }
    } else {
      switch (sistema) {
        case 'CONTROLID': return 'text-red-600 bg-red-100';
        case 'TIME_PRO': return 'text-blue-600 bg-blue-100';
        case 'BINARTECH': return 'text-green-600 bg-green-100';
        case 'AHGORA': return 'text-purple-600 bg-purple-100';
        case 'SIMPAX': return 'text-orange-600 bg-orange-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      {/* Duração */}
      <div className="transform transition-all duration-300 hover:scale-[1.02]">
        <label htmlFor="duracao" className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          ⏱️ Duração <span className="text-red-500">*</span>
        </label>
        <input
          ref={duracaoInputRef}
          type="text"
          id="duracao"
          value={formData.duracao}
          onChange={(e) => handleInputChange('duracao', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
            errors.duracao ? 'border-red-300 shadow-red-100' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
          }`}
          placeholder="Ex: 2h, 45min, 1h30min"
          aria-describedby={errors.duracao ? 'duracao-error' : undefined}
          disabled={isLoading || isSubmitting}
        />
        {errors.duracao && (
          <p id="duracao-error" className="mt-2 text-sm text-red-600 animate-shake" role="alert">
            ❌ {errors.duracao}
          </p>
        )}
      </div>

      {/* Descrição */}
      <div className="transform transition-all duration-300 hover:scale-[1.02]">
        <label htmlFor="descricao" className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          📝 Relato / Descrição <span className="text-red-500">*</span>
        </label>
        <textarea
          id="descricao"
          rows={4}
          value={formData.descricao}
          onChange={(e) => handleInputChange('descricao', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-vertical transition-all duration-300 ${
            errors.descricao ? 'border-red-300 shadow-red-100' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
          }`}
          placeholder="Descreva detalhadamente a tarefa a ser executada..."
          aria-describedby={errors.descricao ? 'descricao-error' : undefined}
          disabled={isLoading || isSubmitting}
        />
        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Mínimo de 10 caracteres
          </p>
          <span className={`text-xs font-medium ${
            charCount < 10 ? 'text-red-500' : charCount < 50 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {charCount}/∞
          </span>
        </div>
        {errors.descricao && (
          <p id="descricao-error" className="mt-2 text-sm text-red-600 animate-shake" role="alert">
            ❌ {errors.descricao}
          </p>
        )}
      </div>

      {/* Tag */}
      <div className="transform transition-all duration-300 hover:scale-[1.02]">
        <label htmlFor="tag" className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          🏷️ Tag <span className="text-red-500">*</span>
        </label>
        <select
          id="tag"
          value={formData.tag}
          onChange={(e) => handleInputChange('tag', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
            isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
          }`}
          disabled={isLoading || isSubmitting}
        >
          <option value="TREINAMENTO">🎓 Treinamento</option>
          <option value="IMPLANTACAO">🚀 Implantação</option>
          <option value="SUPORTE_TECNICO">🔧 Suporte Técnico</option>
          <option value="DESENVOLVIMENTO">💻 Desenvolvimento</option>
          <option value="MANUTENCAO">🔨 Manutenção</option>
        </select>
        <div className="mt-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getTagColor(formData.tag)}`}>
            {formData.tag === 'TREINAMENTO' && '🎓 Treinamento'}
            {formData.tag === 'IMPLANTACAO' && '🚀 Implantação'}
            {formData.tag === 'SUPORTE_TECNICO' && '🔧 Suporte Técnico'}
            {formData.tag === 'DESENVOLVIMENTO' && '💻 Desenvolvimento'}
            {formData.tag === 'MANUTENCAO' && '🔨 Manutenção'}
          </span>
        </div>
      </div>

      {/* Sistema */}
      <div className="transform transition-all duration-300 hover:scale-[1.02]">
        <label htmlFor="sistema" className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          🖥️ Sistema
        </label>
        <select
          id="sistema"
          value={formData.sistema || ''}
          onChange={(e) => handleInputChange('sistema', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
            isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
          }`}
          disabled={isLoading || isSubmitting}
        >
          <option value="">Selecione um sistema (opcional)</option>
          <option value="CONTROLID">🔴 ControlID</option>
          <option value="TIME_PRO">🔵 Time PRO</option>
          <option value="BINARTECH">🟢 BinarTech</option>
          <option value="AHGORA">🟣 Ahgora</option>
          <option value="SIMPAX">🟠 Simpax</option>
        </select>
        {formData.sistema && (
          <div className="mt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getSistemaColor(formData.sistema)}`}>
              {formData.sistema === 'CONTROLID' && '🔴 ControlID'}
              {formData.sistema === 'TIME_PRO' && '🔵 Time PRO'}
              {formData.sistema === 'BINARTECH' && '🟢 BinarTech'}
              {formData.sistema === 'AHGORA' && '🟣 Ahgora'}
              {formData.sistema === 'SIMPAX' && '🟠 Simpax'}
            </span>
          </div>
        )}
      </div>

      {/* Responsável */}
      <div className="transform transition-all duration-300 hover:scale-[1.02]">
        <label htmlFor="responsavelId" className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          👤 Responsável
        </label>
        <select
          id="responsavelId"
          value={formData.responsavelId || ''}
          onChange={(e) => handleInputChange('responsavelId', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
            isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
          }`}
          disabled={isLoading || isSubmitting}
        >
          <option value="">Selecione um responsável (opcional)</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              👤 {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>

      {/* Campo de Vídeo (condicional) */}
      {(formData.tag === 'IMPLANTACAO' || formData.tag === 'TREINAMENTO') && (
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
          <label htmlFor="videoUrl" className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            🎥 Link do Vídeo (opcional)
          </label>
          <input
            type="url"
            id="videoUrl"
            value={formData.videoUrl || ''}
            onChange={(e) => handleInputChange('videoUrl', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ${
              errors.videoUrl ? 'border-red-300 shadow-red-100' : isDarkMode ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="https://exemplo.com/video"
            aria-describedby={errors.videoUrl ? 'videoUrl-error' : undefined}
            disabled={isLoading || isSubmitting}
          />
          {errors.videoUrl && (
            <p id="videoUrl-error" className="mt-2 text-sm text-red-600 animate-shake" role="alert">
              ❌ {errors.videoUrl}
            </p>
          )}
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 animate-fadeInUp">
        <GradientButton
          type="submit"
          disabled={isLoading || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white transform transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            <>
              💾 Salvar Tarefa
            </>
          )}
        </GradientButton>
        
        <RedButton
          type="button"
          onClick={onCancel}
          disabled={isLoading || isSubmitting}
          className="bg-gray-600 hover:bg-gray-700 text-white transform transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
        >
          ❌ Cancelar
        </RedButton>
      </div>
    </form>
  );
};

export default TaskForm; 