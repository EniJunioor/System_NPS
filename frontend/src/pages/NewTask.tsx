import React, { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Calendar, Search, Plus } from 'lucide-react';
import axios from 'axios'; // IMPORTANTE: Adicionar a importação do axios
import { useToast } from '../contexts/ToastContext';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { uploadFiles } from '../services/uploadService';

// --- Componentes internos (sem alterações) ---
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
  const { showToast } = useToast();

  // --- Estados do formulário (sem alterações) ---
  const [titulo, setTitulo] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [duracaoHoras, setDuracaoHoras] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState('');
  const [tag, setTag] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sistema, setSistema] = useState('');
  const [responsavelId, setResponsavelId] = useState('');
  const [projeto, setProjeto] = useState('');
  const [anexos, setAnexos] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [videoUrl] = useState('');
  const [users, setUsers] = useState<{ id: string; name: string; role: string }[]>([]);

  React.useEffect(() => {
    authService.getUsers().then(users => {
      setUsers(users.map(u => ({ id: u.id, name: u.nome, role: u.tipo })));
    });
  }, []);

  // --- Funções de manipulação de arquivos (sem alterações) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setAnexos(prev => [...prev, ...fileList.map(f => f.name)]);
      setFilesToUpload(prev => [...prev, ...fileList]);
    }
  };
  const handleRemoveAnexo = (idx: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== idx));
    setFilesToUpload(prev => prev.filter((_, i) => i !== idx));
  };

  // --- Validação de frontend (sem alterações) ---
  const validate = () => {
    if (!titulo || titulo.length < 5) return 'Título obrigatório (mín. 5 caracteres)';
    if (!prioridade || !['BAIXA','MEDIA','ALTA'].includes(prioridade)) return 'Selecione a prioridade (Baixa, Média ou Alta)';
    if (!descricao || descricao.length < 10) return 'Descrição obrigatória (mín. 10 caracteres)';
    if (!tag || !['TREINAMENTO','IMPLANTACAO','SUPORTE_TECNICO','DESENVOLVIMENTO','MANUTENCAO'].includes(tag)) return 'Selecione uma categoria válida';
    if (!duracaoHoras && !duracaoMinutos) return 'Informe a duração estimada';
    if (!sistema) return 'Selecione o sistema';
    if (!responsavelId) return 'Selecione o responsável';
    // Adicionar validação para 'projeto' se ele for obrigatório no backend
    // if (!projeto) return 'Informe o projeto';
    return null;
  };

  // --- LÓGICA DE SUBMISSÃO ATUALIZADA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      showToast('error', error);
      return;
    }

    try {
      // 1. Lógica de Upload de Anexos (executada primeiro)
      let uploadedFileUrls: string[] = anexos.filter(a => a.startsWith('http'));
      if (filesToUpload.length > 0) {
        const dataTransfer = new DataTransfer();
        filesToUpload.forEach(file => dataTransfer.items.add(file));
        const fileList = dataTransfer.files;
        const newUrls = await uploadFiles(fileList);
        uploadedFileUrls = [...uploadedFileUrls, ...newUrls];
      }

      // 2. Montagem do Payload Corrigido
      const duracaoEmMinutos = (Number(duracaoHoras || 0) * 60) + Number(duracaoMinutos || 0);

      const formatarDataISO = (dateString: string) => {
        if (!dateString) return null;
        // Adiciona T00:00:00Z para tratar a data como UTC e evitar erros de fuso horário
        return new Date(`${dateString}T00:00:00.000Z`).toISOString();
      }

      const payload = {
        titulo,
        prioridade,
        descricao,
        tag: tag as 'TREINAMENTO' | 'IMPLANTACAO' | 'SUPORTE_TECNICO' | 'DESENVOLVIMENTO' | 'MANUTENCAO',
        sistema: sistema as 'CONTROLID' | 'TIME_PRO' | 'BINARTECH' | 'AHGORA' | 'SIMPAX',
        responsavelId,
        projeto: projeto || null, // Envia null se o projeto estiver vazio
        dataInicio: formatarDataISO(dataInicio),
        dataVencimento: formatarDataISO(dataVencimento),
        duracao: duracaoEmMinutos.toString(), // Enviando duração como um NÚMERO (total de minutos)
        anexos: uploadedFileUrls,
        videoUrl,
      };

      // 3. Log para Debug (verifique o console do navegador)
      console.log("Payload que será enviado para a API:", JSON.stringify(payload, null, 2));

      // 4. Envio para o serviço
      await taskService.createTask(payload);
      showToast('success', 'Tarefa criada com sucesso!');
      navigate('/tarefas');

    } catch (err) {
      showToast('error', 'Erro ao criar tarefa. Verifique os dados.');

      // 5. Captura e Exibição do Erro Detalhado do Backend
      if (axios.isAxiosError(err) && err.response) {
        console.error("ERRO 422 - Detalhes da validação do Backend:");
        console.error(JSON.stringify(err.response.data, null, 2));
      } else {
        console.error("Ocorreu um erro inesperado:", err);
      }
    }
  };

  const handleBack = () => navigate('/tarefas');

  // --- JSX do Componente (sem alterações) ---
  return (
    <div className="p-6 bg-gray-50/50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
            {/* ...código do header... */}
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Informações Básicas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Título da Tarefa" placeholder="Digite o título da tarefa" value={titulo} onChange={e => setTitulo(e.target.value)} required minLength={5} />
              <SelectField label="Prioridade" value={prioridade} onChange={e => setPrioridade(e.target.value)} required>
                <option value="">Selecione a prioridade</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </SelectField>
              <InputField label="Data de Início" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
              <InputField label="Data de Vencimento" type="date" value={dataVencimento} onChange={e => setDataVencimento(e.target.value)} />
              <div className="flex items-end gap-2">
                <InputField label="Duração Estimada" placeholder="Horas" type="number" value={duracaoHoras} onChange={e => setDuracaoHoras(e.target.value)} min={0} />
                <input placeholder="Minutos" type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={duracaoMinutos} onChange={e => setDuracaoMinutos(e.target.value)} min={0} max={59}/>
              </div>
              <SelectField label="Tag/Categoria" value={tag} onChange={e => setTag(e.target.value)} required>
                <option value="">Selecione uma categoria</option>
                <option value="TREINAMENTO">Treinamento</option>
                <option value="IMPLANTACAO">Implantação</option>
                <option value="SUPORTE_TECNICO">Suporte Técnico</option>
                <option value="DESENVOLVIMENTO">Desenvolvimento</option>
                <option value="MANUTENCAO">Manutenção</option>
              </SelectField>
            </div>
          </FormSection>
          <FormSection title="Descrição/Relato">
            <TextareaField label="Descrição detalhada da tarefa" placeholder="Descreva detalhadamente a tarefa, objetivos, requisitos e qualquer informação relevante..." value={descricao} onChange={e => setDescricao(e.target.value)} required minLength={10} />
          </FormSection>
          <FormSection title="Atribuição e Sistema">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="Sistema" value={sistema} onChange={e => setSistema(e.target.value)} required>
                <option value="">Selecione o sistema</option>
                <option value="CONTROLID">ControlID</option>
                <option value="TIME_PRO">Time Pro</option>
                <option value="BINARTECH">Binartech</option>
                <option value="AHGORA">Ahgora</option>
                <option value="SIMPAX">Simpax</option>
              </SelectField>
              <SelectField label="Responsável" value={responsavelId} onChange={e => setResponsavelId(e.target.value)} required>
                <option value="">Selecione o responsável</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </SelectField>
            </div>
          </FormSection>
          <FormSection title="Detalhes Adicionais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Inicial</label>
                <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">Pendente</p>
              </div>
              <InputField label="Projeto Relacionado (Opcional)" placeholder="Nome do projeto" value={projeto} onChange={e => setProjeto(e.target.value)} />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Anexos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 bg-gray-50/50">
                    <input type="file" multiple className="hidden" id="file-upload" onChange={handleFileChange} />
                    <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center">
                        <UploadCloud size={32} className="mb-2 text-gray-400" />
                        <p className="text-gray-500">Arraste arquivos aqui ou <span className="font-semibold text-blue-600">clique para selecionar</span></p>
                    </label>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {anexos.map((anexo, idx) => (
                      <div key={anexo + idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-xs">{anexo}</span>
                        <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveAnexo(idx)}>x</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FormSection>
          <footer className="flex justify-between items-center gap-3 pt-4">
            {/* ...código do footer... */}
            <div className="flex items-center gap-2">
                 <button type="button" className="p-2.5 bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200"><Search size={18} /></button>
                 <button type="button" className="p-2.5 bg-gray-100 rounded-md border border-gray-200 hover:bg-gray-200"><Plus size={18} /></button>
            </div>
            <div className="flex items-center gap-3">
                 <button type="button" onClick={handleBack} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                   Cancelar
                 </button>
                 <button type="button" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                   Salvar como Rascunho
                 </button>
                 <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 shadow-sm transition-transform duration-200 hover:scale-105">
                   + Criar Tarefa
                 </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}