import React, { useState, type ChangeEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Calendar, Search, Plus } from 'lucide-react';

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

const InputField = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
        <div className="relative">
            <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            {props.type === 'date' && <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        </div>
    </div>
);

const SelectField = ({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
        <select {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
            {children}
        </select>
    </div>
);

const TextareaField = ({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
        <textarea {...props} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
    </div>
);


export default function NewTask() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/tarefas');

  return (
    <div className="p-6 bg-gray-50/50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Nova Tarefa</h1>
              <p className="text-sm text-gray-500">Criar uma nova tarefa no sistema</p>
            </div>
          </div>
          <div className="flex items-center">
            <img src="https://i.pravatar.cc/150?u=user" alt="User" className="w-10 h-10 rounded-full" />
          </div>
        </header>

        <main className="space-y-6">
            <FormSection title="Informações Básicas">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Título da Tarefa" placeholder="Digite o título da tarefa" />
                    <SelectField label="Prioridade">
                        <option>Selecione a prioridade</option>
                    </SelectField>
                    <InputField label="Data de Início" type="date" />
                    <InputField label="Data de Vencimento" type="date" />
                     <div className="flex items-end gap-2">
                        <InputField label="Duração Estimada" placeholder="Horas" type="number" />
                        <input placeholder="Minutos" type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <SelectField label="Tag/Categoria">
                        <option>Selecione uma categoria</option>
                    </SelectField>
                </div>
            </FormSection>

            <FormSection title="Descrição/Relato">
                <TextareaField label="Descrição detalhada da tarefa" placeholder="Descreva detalhadamente a tarefa, objetivos, requisitos e qualquer informação relevante..." />
            </FormSection>

            <FormSection title="Atribuição e Sistema">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField label="Sistema">
                        <option>Selecione o sistema</option>
                    </SelectField>
                    <SelectField label="Responsável">
                        <option>Selecione o responsável</option>
                    </SelectField>
                 </div>
            </FormSection>

            <FormSection title="Detalhes Adicionais">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Status Inicial</label>
                         <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">Pendente</p>
                    </div>
                     <SelectField label="Projeto Relacionado">
                        <option>Nenhum projeto específico</option>
                    </SelectField>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Anexos</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 bg-gray-50/50">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                                <UploadCloud size={32} className="mb-2 text-gray-400" />
                                <p>Arraste arquivos aqui ou <span className="font-semibold text-blue-600">clique para selecionar</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </FormSection>
            
            <footer className="flex justify-between items-center gap-3 pt-4">
                <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200"><Search size={18} /></button>
                     <button className="p-2.5 bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200"><Plus size={18} /></button>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                        Cancelar
                    </button>
                    <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                        Salvar como Rascunho
                    </button>
                    <button className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 shadow-sm transition-transform duration-200 hover:scale-105">
                        + Criar Tarefa
                    </button>
                </div>
            </footer>
        </main>
      </div>
    </div>
  );
} 