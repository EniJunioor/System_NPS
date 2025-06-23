import React, { useState } from 'react';
import { Key, RefreshCw, Calendar, Check } from 'lucide-react';
import { api } from '../services/api';
import { toast, Toaster } from 'react-hot-toast';
import { useToast } from '../contexts/ToastContext';
import type { AxiosError } from 'axios';

// Este componente foi movido para fora para evitar recriação a cada renderização
const InputField = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <div className="relative">
            <input {...props} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-gray-50/50" />
            {props.name === 'dataAtendimento' && <Calendar size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        </div>
    </div>
);

const TokenGenerator = () => {
  const [formData, setFormData] = useState({
    telefone: '',
    atendente: '',
    dataAtendimento: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'telefone') {
      const onlyNums = value.replace(/\D/g, '');

      if (onlyNums.length <= 11) {
        let formatted = onlyNums;
        if (onlyNums.length > 2) {
          formatted = `(${onlyNums.substring(0, 2)}) ${onlyNums.substring(2)}`;
        }
        if (onlyNums.length > 7) {
          formatted = `(${onlyNums.substring(0, 2)}) ${onlyNums.substring(2, 7)}-${onlyNums.substring(7)}`;
        }
        
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const generateToken = async () => {
    if (!formData.telefone || !formData.atendente || !formData.dataAtendimento) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/tokens', formData);
      const evaluationLink = `${window.location.origin}/evaluate/${response.data.valor}`;
      
      setGeneratedToken(response.data.valor);
      setGeneratedLink(evaluationLink);
      setGeneratedAt(new Date());
      setExpiresAt(response.data.expiraEm ? new Date(response.data.expiraEm) : null);
      toast.success('Token gerado e link copiado para a área de transferência!');
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
      if (err.response?.status === 401) {
        showToast('error', 'Sessão expirada', 'Faça login novamente para gerar tokens.');
      } else {
        const errorMsg = (err.response?.data && typeof err.response.data === 'object' && 'error' in err.response.data)
          ? (err.response.data as { error: string }).error
          : 'Erro desconhecido';
        showToast('error', 'Erro ao gerar token', errorMsg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      telefone: '',
      atendente: '',
      dataAtendimento: '',
    });
    setGeneratedToken(null);
    setGeneratedLink(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success('Copiado para a área de transferência!');
  };

  // Log para debug
  console.log('TOKEN:', generatedToken, 'LINK:', generatedLink);

  // Função utilitária para encurtar o link
  function shortenLink(link: string | null) {
    if (!link) return '';
    // Exibe os 25 primeiros e 8 últimos caracteres
    if (link.length <= 40) return link;
    return link.slice(0, 25) + '...' + link.slice(-8);
  }

  // Função utilitária para formatar data/hora
  function formatDateTime(date: Date) {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Toaster position="top-center" />
      <div className="max-w-2xl w-full">
        <div className="bg-white p-10 sm:p-14 rounded-3xl shadow-xl space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gerador de Token
            </h1>
            <p className="mt-2 text-md text-gray-500">
              Crie tokens únicos para avaliação de NPS
            </p>
          </div>

          <div className="space-y-6">
            <InputField 
                label="Telefone do Cliente"
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
            />
            <InputField 
                label="Nome do Atendente"
                type="text"
                name="atendente"
                value={formData.atendente}
                onChange={handleInputChange}
                placeholder="Ex: João Silva"
            />
            <InputField 
                label="Data e Hora do Atendimento"
                type="datetime-local"
                name="dataAtendimento"
                value={formData.dataAtendimento}
                onChange={handleInputChange}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={generateToken}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw size={20} className="animate-spin" /> : <Key size={20} />}
              {isGenerating ? 'Gerando...' : 'Gerar Token'}
            </button>

            <button
              onClick={resetForm}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold w-full"
            >
              <RefreshCw size={20} />
              Limpar
            </button>
          </div>

          {generatedToken && (
            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-3 max-w-2xl mx-auto">
              {generatedLink && (
                <>
                  <div className="text-gray-800 text-base mb-2 font-medium">Link para avaliação:</div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <input
                      type="text"
                      readOnly
                      value={shortenLink(generatedLink)}
                      className="w-full sm:w-[420px] px-4 py-2 border border-gray-300 rounded-lg text-gray-800 font-mono text-base bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 text-center cursor-pointer select-all"
                      onClick={e => (e.target as HTMLInputElement).select()}
                      style={{ minWidth: '280px', maxWidth: '100%' }}
                    />
                    <button
                      onClick={() => handleCopy(generatedLink)}
                      className={`flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-base font-semibold transition-colors ml-0 sm:ml-2`}
                    >
                      {copied ? <Check size={20} className="text-green-300" /> : null}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-3">Token: <span className="font-mono">{generatedToken}</span></div>
                  {(generatedAt || expiresAt) && (
                    <div className="text-xs text-gray-500 mt-1">
                      {generatedAt && (
                        <span>Gerado em: {formatDateTime(generatedAt)}</span>
                      )}
                      {generatedAt && expiresAt && <span> &nbsp;|&nbsp; </span>}
                      {expiresAt && (
                        <span>Válido até: {formatDateTime(expiresAt)}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenGenerator; 