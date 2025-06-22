import React, { useState } from 'react';
import { Key, RefreshCw, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

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
      const response = await axios.post('http://localhost:3001/tokens', formData);
      const evaluationLink = `${window.location.origin}/evaluate/${response.data.token}`;
      
      navigator.clipboard.writeText(evaluationLink);
      toast.success('Token gerado e link copiado para a área de transferência!');
      
    } catch (err) {
      toast.error('Erro ao gerar token. Tente novamente.');
      console.error(err);
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
  };

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Toaster position="top-center" />
      <div className="max-w-md w-full">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-8">
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
        </div>
      </div>
    </div>
  );
};

export default TokenGenerator; 