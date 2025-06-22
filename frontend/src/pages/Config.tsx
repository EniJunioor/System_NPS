import React, { useState } from 'react';
import { User, Shield, Bell, Palette, Code, Trash2 } from 'lucide-react';

const tabs = [
  { name: 'Geral', icon: User },
  { name: 'Segurança', icon: Shield },
  { name: 'Notificações', icon: Bell },
  { name: 'Aparência', icon: Palette },
  { name: 'API', icon: Code },
];

export default function Config() {
  const [activeTab, setActiveTab] = useState('Geral');

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
            <p className="text-gray-500 mb-8">Gerencie suas preferências e configurações do sistema</p>
          </div>
          <div className="w-full max-w-5xl flex gap-16 items-start">
            {/* Menu de abas */}
            <div className="w-56 flex-shrink-0">
              <div className="flex flex-col space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-3 p-3 rounded-lg text-base font-semibold transition-colors w-full text-left ${
                      activeTab === tab.name
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    <tab.icon size={20} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Conteúdo */}
            <div className="flex-1">
              {activeTab === 'Geral' ? <GeneralSettings /> : <ComingSoon />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  const [settings, setSettings] = useState({
    name: 'João Silva',
    email: 'joao@exemplo.com',
    timezone: 'UTC-3',
    language: 'pt-br',
    darkMode: false,
    emailNotifications: true,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">Configurações Gerais</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">Atualize suas informações pessoais e preferências</p>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input type="text" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.email} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuso Horário</label>
              <select value={settings.timezone} onChange={e => setSettings({ ...settings, timezone: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                <option value="UTC-3">UTC-3 (Brasília)</option>
                <option value="UTC-2">UTC-2 (Fernando de Noronha)</option>
                <option value="UTC-4">UTC-4 (Amazonas)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
              <select value={settings.language} onChange={e => setSettings({ ...settings, language: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                <option value="pt-br">Português (BR)</option>
                <option value="en-us">English (US)</option>
              </select>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-base font-bold text-gray-800 mb-2">Preferências do Sistema</h3>
            <div className="space-y-4">
              <PurpleSwitch label="Modo Escuro" description="Ativar tema escuro para toda a aplicação" enabled={settings.darkMode} onToggle={() => handleToggle('darkMode')} />
              <PurpleSwitch label="Notificações por Email" description="Receber atualizações importantes por email" enabled={settings.emailNotifications} onToggle={() => handleToggle('emailNotifications')} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button type="button" className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="px-5 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 shadow-sm">Salvar Alterações</button>
          </div>
        </form>
      </div>
      {/* Zona de Perigo */}
      <div className="bg-white p-8 rounded-xl border border-red-200">
        <h2 className="text-base font-bold text-red-600 mb-2">Zona de Perigo</h2>
        <p className="text-gray-500 text-sm mb-6">Ações irreversíveis que afetam sua conta</p>
        <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg bg-red-50/50">
          <div>
            <h3 className="font-semibold text-gray-800">Excluir Conta</h3>
            <p className="text-sm text-gray-600">Permanentemente excluir sua conta e todos os dados</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors shadow-sm">
            <Trash2 size={18} />
            Excluir Conta
          </button>
        </div>
      </div>
    </div>
  );
}

interface PurpleSwitchProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const PurpleSwitch: React.FC<PurpleSwitchProps> = ({ label, description, enabled, onToggle }) => (
  <div className="flex justify-between items-center">
    <div>
      <h4 className="font-medium text-gray-800">{label}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <button
      onClick={onToggle}
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

function ComingSoon() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <span className="text-gray-400 text-lg font-semibold">Em breve...</span>
    </div>
  );
} 