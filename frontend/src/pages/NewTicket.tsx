import React, { useState, type ChangeEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Calendar } from 'lucide-react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800 mb-6">{title}</h2>
    {children}
  </div>
);

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField = ({ label, ...props }: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
    <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

const SelectField = ({ label, children, ...props }: SelectFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
    <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
      {children}
    </select>
  </div>
);

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

const TextareaField = ({ label, ...props }: TextareaFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea {...props} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const CheckboxField = ({ label, ...props }: CheckboxFieldProps) => (
    <label className="flex items-center gap-3">
        <input type="checkbox" {...props} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);


export default function NewTicket() {
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: '',
    priority: '',
    description: '',
    reproSteps: '',
    expectedResult: '',
    assignTo: '',
    deadline: '',
    tags: '',
    notifyClient: false,
    markUrgent: false,
    autoAssign: false,
  });

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/tickets');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="p-6 bg-gray-50/50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Novo Ticket</h1>
              <p className="text-sm text-gray-500">Crie um novo ticket de suporte</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
              Cancelar
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:opacity-90 shadow-sm transition-transform duration-200 hover:scale-105">
              Criar Ticket
            </button>
          </div>
        </header>
        
        <main className="space-y-6">
          <FormSection title="Informações Básicas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Título do Ticket" name="title" value={formData.title} onChange={handleChange} placeholder="Digite o título do ticket" />
              <SelectField label="Cliente" name="client" value={formData.client} onChange={handleChange}>
                <option value="">Selecione um cliente</option>
                <option value="1">Ana Silva</option>
                <option value="2">João Santos</option>
              </SelectField>
              <SelectField label="Categoria" name="category" value={formData.category} onChange={handleChange}>
                <option value="">Selecione uma categoria</option>
                <option value="bug">Bug/Erro</option>
                <option value="feature">Solicitação de Feature</option>
              </SelectField>
              <SelectField label="Prioridade" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="">Selecione a prioridade</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </SelectField>
            </div>
          </FormSection>

          <FormSection title="Descrição do Problema">
            <div className="space-y-6">
              <TextareaField label="Descrição Detalhada *" name="description" value={formData.description} onChange={handleChange} placeholder="Descreva detalhadamente o problema ou solicitação..." />
              <TextareaField label="Passos para Reproduzir" name="reproSteps" value={formData.reproSteps} onChange={handleChange} placeholder="Liste os passos necessários para reproduzir o problema..." />
              <TextareaField label="Resultado Esperado" name="expectedResult" value={formData.expectedResult} onChange={handleChange} placeholder="Descreva qual seria o comportamento esperado..." />
            </div>
          </FormSection>

          <FormSection title="Anexos">
            <div className="group border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-transparent hover:bg-gradient-to-r from-purple-600 to-blue-600 bg-gray-50/50 transition-all duration-300">
              <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-white">
                <UploadCloud size={40} className="mb-2 text-gray-400 group-hover:text-white transition-colors" />
                <p className="font-semibold text-blue-600 group-hover:text-white transition-colors">Clique para fazer upload ou arraste arquivos aqui</p>
                <p className="text-xs group-hover:text-gray-200 transition-colors">PNG, JPG, PDF até 10MB cada</p>
              </div>
            </div>
          </FormSection>

          <FormSection title="Configurações Adicionais">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <SelectField label="Atribuir para" name="assignTo" value={formData.assignTo} onChange={handleChange}>
                      <option value="">Não atribuído</option>
                      <option value="1">Equipe de Suporte</option>
                      <option value="2">Equipe de Desenvolvimento</option>
                  </SelectField>
                  <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Resolução</label>
                      <input type="text" name="deadline" value={formData.deadline} onChange={handleChange} placeholder="dd/mm/aaaa" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                      <Calendar size={18} className="absolute right-3 top-9 text-gray-400" />
                  </div>
                  <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Digite tags separadas por vírgula" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                      <p className="text-xs text-gray-500 mt-1">Ex: login, api, integração</p>
                  </div>
              </div>
              <div className="space-y-4">
                  <CheckboxField label="Notificar cliente por email" name="notifyClient" checked={formData.notifyClient} onChange={handleChange} />
                  <CheckboxField label="Marcar como urgente" name="markUrgent" checked={formData.markUrgent} onChange={handleChange} />
                  <CheckboxField label="Atribuição automática baseada na categoria" name="autoAssign" checked={formData.autoAssign} onChange={handleChange} />
              </div>
          </FormSection>
          
          <footer className="flex justify-end items-center gap-3 pt-4">
            <button className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
              Salvar como Rascunho
            </button>
            <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 shadow-sm transition-transform duration-200 hover:scale-105">
              + Criar Ticket
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
} 