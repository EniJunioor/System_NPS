import React, { useState, useRef } from 'react';
import { Camera, User, Mail, Phone, Shield, CalendarDays, Ticket, CheckSquare, Clock } from "lucide-react";

// Dados mockados para o usuário
const mockUser = {
  nome: 'João da Silva',
  sobrenome: 'Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-9999',
  tipo: 'Administrador',
  photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377d64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzAzMzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcG9ydHJhaXN8ZW58MHx8fHwxNzE4NzMyNjI5fDA&ixlib=rb-4.0.3&q=80&w=400', // Adicionei uma foto de exemplo
};

const ProfileCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white p-6 rounded-lg border border-gray-200 transition-all hover:shadow-lg ${className}`}>
    {children}
  </div>
);

const GradientButton = ({ children }: { children: React.ReactNode }) => (
  <button
    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all transform hover:scale-105 shadow-sm"
  >
    {children}
  </button>
);

const SecondaryButton = ({ children }: { children: React.ReactNode }) => (
    <button className="px-5 py-2 border border-purple-300 text-purple-700 font-semibold rounded-md hover:bg-purple-50 transition-colors">
        {children}
    </button>
);

const Profile = () => {
  const user = mockUser;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.nome || '',
    sobrenome: user?.sobrenome || '',
    email: user?.email || '',
    phone: user?.phone || '',
    tipo: user?.tipo || '',
    photo: user?.photo || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simular delay de atualização
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Aqui você pode adicionar lógica para atualizar telefone e senha
      if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
        alert('As senhas não coincidem!');
        setIsLoading(false);
        return;
      }
      // Simular atualização
      setIsEditing(false);
      setPasswordData({ newPassword: '', confirmPassword: '', showPassword: false });
      alert('Perfil atualizado com sucesso!');
    } catch {
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.nome || '',
      sobrenome: user?.sobrenome || '',
      email: user?.email || '',
      phone: user?.phone || '',
      tipo: user?.tipo || '',
      photo: user?.photo || '',
    });
    setPasswordData({ newPassword: '', confirmPassword: '', showPassword: false });
  };

  const stats = [
    { icon: Ticket, label: 'Tickets Abertos', value: 12, color: 'bg-blue-100 text-blue-600' },
    { icon: CheckSquare, label: 'Tarefas Concluídas', value: 48, color: 'bg-green-100 text-green-600' },
    { icon: Clock, label: 'Tempo Online', value: '156h', color: 'bg-purple-100 text-purple-600' },
  ];

  const recentActivity = [
    { text: 'Ticket #1234 resolvido', time: '2 horas atrás', color: 'bg-green-500' },
    { text: 'Nova tarefa criada', time: '5 horas atrás', color: 'bg-blue-500' },
    { text: 'Perfil atualizado', time: '1 dia atrás', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <ProfileCard className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
            <img src="https://i.pravatar.cc/150?u=joao" alt="João Silva" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
            <button className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1.5 rounded-full border-2 border-white hover:bg-purple-700 transition-colors">
                <Camera size={16} />
            </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{formData.name} {formData.sobrenome}</h1>
          <p className="text-gray-600">{formData.tipo}</p>
          <div className="flex justify-center sm:justify-start flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Mail size={16} /> {formData.email}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={16} /> Membro desde Jan 2024</span>
          </div>
        </div>
        <div>
          <GradientButton>Editar Perfil</GradientButton>
        </div>
      </ProfileCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <ProfileCard>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Informações Pessoais</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <User size={16} className="text-gray-500"/> Nome
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <User size={16} className="text-gray-500"/> Sobrenome
                  </label>
                  <input type="text" name="sobrenome" value={formData.sobrenome} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
                </div>
              </div>
              <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Mail size={16} className="text-gray-500"/> Email
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
              </div>
               <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="text-gray-500"/> Telefone
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
              </div>
              <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Shield size={16} className="text-gray-500"/> Tipo de Usuário
                  </label>
                  <input type="text" name="tipo" value={formData.tipo} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" />
              </div>
              <div className="text-right">
                <GradientButton>Salvar Alterações</GradientButton>
              </div>
            </form>
          </ProfileCard>
          
          <ProfileCard>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Configurações de Segurança</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">Autenticação de Dois Fatores</h3>
                  <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                </div>
                <SecondaryButton>Ativar</SecondaryButton>
              </div>
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold">Alterar Senha</h3>
                  <p className="text-sm text-gray-500">Última alteração há 30 dias</p>
                </div>
                <SecondaryButton>Alterar</SecondaryButton>
              </div>
            </div>
          </ProfileCard>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ProfileCard>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Estatísticas</h2>
            <div className="space-y-4">
              {stats.map(stat => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </ProfileCard>

          <ProfileCard>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
            <div className="relative space-y-6">
              {/* Timeline line */}
              <div className="absolute left-2.5 top-2.5 h-full w-0.5 bg-gray-200"></div>
              {recentActivity.map(activity => (
                <div key={activity.text} className="flex items-center gap-4 relative">
                  <div className={`h-5 w-5 rounded-full border-4 border-white z-10 ${activity.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;