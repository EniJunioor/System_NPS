import React, { useState, useEffect, type ChangeEvent, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Calendar } from 'lucide-react';
import { ticketService, api, uploadFiles } from '../services'; // Importe a instância da API e o serviço de upload
import Modal from '../components/layout/Modal';
import { useToast } from '../contexts/ToastContext';

// Interface para o tipo de usuário que virá da API
interface User {
  id: string;
  name: string;
  role: string;
}

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

interface FormData {
  title: string;
  client: string;
  category: string;
  priority: string;
  description: string;
  reproSteps: string;
  expectedResult: string;
  assignTo: string;
  deadline: string;
  tags: string;
  notifyClient: boolean;
  markUrgent: boolean;
  autoAssign: boolean;
  anexos: string[];
  filesToUpload: File[];
  data: string;
  hora: string;
}

// Tipo para o payload de criação/edição de ticket
type TicketPayload = {
  titulo: string;
  descricao: string;
  categoria: string;
  tags: string[];
  urgencia: string;
  anexos: string[];
  data: string;
  hora: string;
  reproSteps: string;
  expectedResult: string;
  deadline: string | null;
  notifyClient: boolean;
  markUrgent: boolean;
  autoAssign: boolean;
  atendidoPorId: string | null;
  status?: string;
};

// Adiciona uma função para obter a data e hora atuais formatadas
const getCurrentDateTime = () => {
    const now = new Date();
    // Ajusta para o fuso horário local (ex: 'America/Sao_Paulo')
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));

    const data = zonedDate.toISOString().split('T')[0];
    const hora = zonedDate.toTimeString().slice(0, 5);
    return { data, hora };
};

export default function TicketFormPage({ onClose }: { onClose?: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    client: '',
    category: 'DUVIDA', // Valor padrão
    priority: 'BAIXA',  // Valor padrão
    description: '',
    reproSteps: '',
    expectedResult: '',
    assignTo: '',
    deadline: '',
    tags: '',
    notifyClient: false,
    markUrgent: false,
    autoAssign: false,
    anexos: [],
    filesToUpload: [],
    ...getCurrentDateTime(), // Define data e hora atuais
  });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [users, setUsers] = useState<User[]>([]); // Para "Atribuir para"
  const [clients, setClients] = useState<User[]>([]); // Para "Cliente"
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const { showToast } = useToast();

  // Para tags como select múltiplo invisível
  const TAGS_OPTIONS = [
    'BUG', 'DÚVIDA', 'MELHORIA', 'URGENTE', 'RETORNO', 'OUTRO'
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // Sincroniza tags do formData com selectedTags
  useEffect(() => {
    if (formData.tags) {
      setSelectedTags(formData.tags.split(',').map(t => t.trim()).filter(Boolean));
    }
  }, [formData.tags]);
  // Atualiza formData.tags ao selecionar tags
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedTags(options);
    setFormData(prev => ({ ...prev, tags: options.join(',') }));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        const allUsers: User[] = response.data;
        setUsers(allUsers); // Todos os usuários para atribuição

        // Filtra apenas os clientes para o campo "Cliente"
        const clientUsers = allUsers.filter(user => user.role === 'CLIENTE');
        setClients(clientUsers);

      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      }
    };

    fetchUsers();

    if (id) {
      setIsEditMode(true);
      setIsLoading(true);
      ticketService.getTicketById(id)
        .then(ticket => {
          setFormData({
            title: ticket.titulo || '',
            client: ticket.client || '',
            category: ticket.categoria || '',
            priority: ticket.urgencia || '',
            description: ticket.descricao || '',
            reproSteps: ticket.reproSteps || '',
            expectedResult: ticket.expectedResult || '',
            assignTo: ticket.atendidoPorId || '',
            deadline: ticket.deadline ? ticket.deadline.split('T')[0] : '',
            tags: ticket.tags ? ticket.tags.join(',') : '',
            notifyClient: !!ticket.notifyClient,
            markUrgent: !!ticket.markUrgent,
            autoAssign: !!ticket.autoAssign,
            anexos: Array.isArray(ticket.anexos) ? ticket.anexos : [],
            filesToUpload: [],
            data: ticket.data ? ticket.data.split('T')[0] : '',
            hora: ticket.hora ? ticket.hora.split('T')[1]?.slice(0,5) : '',
          });
        })
        .catch(error => {
          console.error("Failed to fetch ticket", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleBack = () => {
    if (onClose) onClose();
    else navigate('/tickets');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      setFormData(prev => ({
        ...prev,
        anexos: [...prev.anexos, ...fileList.map(f => f.name)],
        filesToUpload: [...prev.filesToUpload, ...fileList]
      }));
    }
  };

  const handleRemoveAnexo = (indexToRemove: number) => {
    setFormData(prev => {
      const anexoToRemove = prev.anexos[indexToRemove];

      const newAnexos = prev.anexos.filter((_, index) => index !== indexToRemove);

      // Se não for uma URL, também remove da lista de arquivos a serem upados
      let newFilesToUpload = prev.filesToUpload;
      if (!anexoToRemove.startsWith('http')) {
        newFilesToUpload = prev.filesToUpload.filter(file => file.name !== anexoToRemove);
      }
      
      return {
        ...prev,
        anexos: newAnexos,
        filesToUpload: newFilesToUpload,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Fazer upload dos anexos primeiro
      let uploadedFileUrls: string[] = formData.anexos.filter(anexo => anexo.startsWith('http'));
      if (formData.filesToUpload.length > 0) {
        const dataTransfer = new DataTransfer();
        formData.filesToUpload.forEach(file => dataTransfer.items.add(file));
        const fileList = dataTransfer.files;
        const newUrls = await uploadFiles(fileList);
        uploadedFileUrls = [...uploadedFileUrls, ...newUrls];
      }
      const dataToSend: TicketPayload = {
        titulo: formData.title,
        descricao: formData.description,
        categoria: formData.category,
        tags: selectedTags,
        urgencia: formData.priority,
        anexos: uploadedFileUrls,
        data: formData.data ? new Date(formData.data).toISOString() : new Date().toISOString(),
        hora: formData.hora ? new Date(`${formData.data}T${formData.hora}`).toISOString() : new Date().toISOString(),
        reproSteps: formData.reproSteps,
        expectedResult: formData.expectedResult,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        notifyClient: formData.notifyClient,
        markUrgent: formData.markUrgent,
        autoAssign: formData.autoAssign,
        atendidoPorId: formData.assignTo || null,
      };

      // Validação simples dos campos obrigatórios
      if (!dataToSend.titulo || dataToSend.titulo.length < 5) {
        alert('Título é obrigatório e deve ter pelo menos 5 caracteres.');
        setIsLoading(false);
        return;
      }
      if (!dataToSend.descricao || dataToSend.descricao.length < 10) {
        alert('Descrição é obrigatória e deve ter pelo menos 10 caracteres.');
        setIsLoading(false);
        return;
      }
      if (!dataToSend.categoria || !['DUVIDA','INCIDENTE','SOLICITACAO','MELHORIA'].includes(dataToSend.categoria)) {
        alert('Categoria é obrigatória e deve ser uma das opções válidas.');
        setIsLoading(false);
        return;
      }
      if (!dataToSend.urgencia || !['BAIXA','MEDIA','ALTA','CRITICA'].includes(dataToSend.urgencia)) {
        alert('Prioridade é obrigatória e deve ser uma das opções válidas.');
        setIsLoading(false);
        return;
      }
      if (!dataToSend.data || isNaN(Date.parse(dataToSend.data))) {
        alert('Data é obrigatória e deve ser válida.');
        setIsLoading(false);
        return;
      }
      if (!dataToSend.hora || isNaN(Date.parse(dataToSend.hora))) {
        alert('Hora é obrigatória e deve ser válida.');
        setIsLoading(false);
        return;
      }

      console.log('Payload enviado:', dataToSend);

      if (isEditMode && id) {
        await ticketService.updateTicket(id, dataToSend);
        showToast('success', 'Ticket atualizado com sucesso!');
      } else {
        await ticketService.createTicket(dataToSend);
        showToast('success', 'Ticket criado com sucesso!');
      }
      navigate('/tickets');
    } catch (error) {
      console.error('Erro ao salvar ticket', error);
      // Define um tipo para o erro de validação do Joi
      type JoiError = { message: string; path: (string | number)[] };
      
      // Melhora a verificação do tipo do erro
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response: { data?: { errors?: JoiError[], error?: string, messages?: string } } };
        const responseData = axiosError.response.data;

        if (responseData && responseData.messages) {
            alert('Erro de validação:\n' + responseData.messages);
        } else if (responseData && Array.isArray(responseData.errors)) {
          // Exibe erros de validação do Joi (formato antigo, mantido por segurança)
          const errorMessages = responseData.errors.map((err) => err.message).join('\n');
          alert('Erro de validação:\n' + errorMessages);
        } else if (responseData && responseData.error) {
          alert('Erro ao salvar ticket: ' + responseData.error);
        } else {
            alert('Erro ao salvar ticket. Verifique os campos e tente novamente.');
        }
      } else {
        alert('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizar = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await ticketService.updateTicket(id, { status: 'FINALIZADO' });
      alert('Atendimento finalizado com sucesso!');
      navigate('/tickets');
    } catch (error) {
      console.error('Erro ao finalizar o ticket', error);
      alert('Não foi possível finalizar o atendimento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferir = () => {
    if (users.length > 0) {
      setSelectedUser(users[0].id); // Pré-seleciona o primeiro usuário
    }
    setTransferModalOpen(true);
  };

  const handleConfirmTransfer = async () => {
    if (!id || !selectedUser) {
      alert('Selecione um usuário para transferir o ticket.');
      return;
    }

    setIsLoading(true);
    try {
      await ticketService.updateTicket(id, { atendidoPorId: selectedUser });
      // Atualiza o formulário com o novo usuário atribuído
      setFormData(prev => ({ ...prev, assignTo: selectedUser }));
      alert('Ticket transferido com sucesso!');
      setTransferModalOpen(false);
    } catch (error) {
      console.error('Erro ao transferir ticket:', error);
      alert('Não foi possível transferir o ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return <div>Carregando informações do ticket...</div>;
  }

  return (
    <div className="p-6 bg-gray-50/50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-900 cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{isEditMode ? 'Editar Ticket' : 'Novo Ticket'}</h1>
              <p className="text-sm text-gray-500">{isEditMode ? `Editando o ticket #${id}` : 'Crie um novo ticket de suporte'}</p>
            </div>
          </div>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Informações Básicas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Título do Ticket" name="title" value={formData.title} onChange={handleChange} placeholder="Digite o título do ticket" />
              <SelectField label="Cliente" name="client" value={formData.client} onChange={handleChange}>
                <option value="">Selecione um cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </SelectField>
              <SelectField label="Categoria" name="category" value={formData.category} onChange={handleChange}>
                <option value="">Selecione uma categoria</option>
                <option value="DUVIDA">Dúvida</option>
                <option value="INCIDENTE">Incidente</option>
                <option value="SOLICITACAO">Solicitação</option>
                <option value="MELHORIA">Melhoria</option>
              </SelectField>
              <SelectField label="Prioridade" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="">Selecione a prioridade</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </SelectField>
            </div>
          </FormSection>

          <FormSection title="Descrição do Problema">
            <div className="space-y-6">
              <TextareaField label="Descrição Detalhada" name="description" value={formData.description} onChange={handleChange} placeholder="Descreva detalhadamente o problema ou solicitação..." />
              <TextareaField label="Passos para Reproduzir" name="reproSteps" value={formData.reproSteps} onChange={handleChange} placeholder="Liste os passos necessários para reproduzir o problema..." />
              <TextareaField label="Resultado Esperado" name="expectedResult" value={formData.expectedResult} onChange={handleChange} placeholder="Descreva qual seria o comportamento esperado..." />
            </div>
          </FormSection>

          <FormSection title="Anexos">
            <div className="group border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-transparent hover:bg-gray-50 transition-all duration-300">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <UploadCloud size={40} className="mb-2 text-gray-400" />
                <p className="mb-2">Arraste e solte arquivos aqui ou clique para selecionar</p>
                <input type="file" multiple className="hidden" id="file-upload" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-all">Selecionar arquivos</label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {formData.anexos.map((anexo, idx) => (
                  <div key={anexo + idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                    {anexo.startsWith('http') ? (
                      <a href={anexo} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Anexo {idx + 1}</a>
                    ) : (
                      <span className="text-xs">{anexo}</span>
                    )}
                    <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveAnexo(idx)}>x</button>
                  </div>
                ))}
              </div>
            </div>
          </FormSection>

          <FormSection title="Configurações Adicionais">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <SelectField label="Atribuir para" name="assignTo" value={formData.assignTo} onChange={handleChange}>
                      <option value="">Não atribuído</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                  </SelectField>
                  <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prazo de Resolução</label>
                      <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} placeholder="dd/mm/aaaa" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                      <Calendar size={18} className="absolute right-3 top-9 text-gray-400" />
                  </div>
              </div>
              <div className="space-y-4">
                  <CheckboxField label="Notificar cliente por email" name="notifyClient" checked={formData.notifyClient} onChange={handleChange} />
                  <CheckboxField label="Marcar como urgente" name="markUrgent" checked={formData.markUrgent} onChange={handleChange} />
                  <CheckboxField label="Atribuição automática baseada na categoria" name="autoAssign" checked={formData.autoAssign} onChange={handleChange} />
              </div>
              <footer className="flex justify-end items-center gap-3 pt-4">
                <button className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100" type="button" onClick={handleBack}>
                  Cancelar
                </button>

                {isEditMode ? (
                  <>
                    <button type="button" onClick={handleFinalizar} className="px-5 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 shadow-sm transition-transform duration-200 hover:scale-105">
                        Finalizar Atendimento
                    </button>
                    <button type="button" onClick={handleTransferir} className="px-5 py-2.5 text-sm font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 shadow-sm transition-transform duration-200 hover:scale-105">
                        Transferir
                    </button>
                    <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:opacity-90 shadow-sm transition-transform duration-200 hover:scale-105">
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                  </>
                ) : (
                    <button type="submit" disabled={isLoading} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:opacity-90 shadow-sm transition-transform duration-200 hover:scale-105">
                        {isLoading ? 'Salvando...' : 'Criar Ticket'}
                    </button>
                )}
              </footer>
          </FormSection>

          <FormSection title="Tags">
            {/* Campo visual igual, mas select múltiplo invisível para lógica */}
            <input type="text" name="tags" value={selectedTags.join(',')} onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))} placeholder="Separe por vírgula" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            <select multiple value={selectedTags} onChange={handleTagChange} style={{ display: 'none' }}>
              {TAGS_OPTIONS.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </FormSection>
        </form>

        {isTransferModalOpen && (
          <Modal onClose={() => setTransferModalOpen(false)}>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Transferir Ticket</h3>
              <div className="mb-4">
                <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione um novo responsável:
                </label>
                <select
                  id="user-select"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setTransferModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmTransfer}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:opacity-90 shadow-sm"
                >
                  {isLoading ? 'Transferindo...' : 'Confirmar Transferência'}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}