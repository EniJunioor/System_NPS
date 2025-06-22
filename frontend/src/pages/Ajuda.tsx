import { ChevronRight, Code, Cog, Headset, HelpCircle, Mail, MessageSquare, PlayCircle, Rocket, Search, Wand2, Wrench, Youtube } from 'lucide-react';
import React, { useState } from 'react';

// Componente para um item da lista de ajuda (artigo)
const HelpListItem = ({ text, subtext }: { text: string; subtext: string }) => (
  <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
    <div>
      <p className="font-semibold text-gray-800">{text}</p>
      <p className="text-sm text-gray-500">{subtext}</p>
    </div>
    <ChevronRight className="h-5 w-5 text-gray-400" />
  </a>
);

// Componente para a seção de Perguntas Frequentes (FAQ)
const FaqItem = ({ question, children }: { question: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-gray-200 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
        <p className="font-semibold text-gray-800">{question}</p>
        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 pr-6">
          {children}
        </div>
      )}
    </div>
  );
};


export default function Ajuda() {
  const topics = {
    gettingStarted: [
      { text: "Como criar minha primeira pesquisa NPS", subtext: "Guia passo a passo para configurar sua pesquisa" },
      { text: "Configurando tokens de avaliação", subtext: "Aprenda a gerar e gerenciar tokens" },
      { text: "Entendendo o dashboard", subtext: "Navegue pelos relatórios e métricas" },
    ],
    features: [
      { text: "Gerenciamento de tickets", subtext: "Como criar e acompanhar tickets" },
      { text: "Sistema de tarefas", subtext: "Organize e delegue atividades" },
      { text: "Chat e comunicação", subtext: "Interaja com sua equipe em tempo real" },
    ],
    api: [
      { text: "Documentação da API", subtext: "Endpoints e exemplos de uso" },
      { text: "Webhook do WhatsApp", subtext: "Configure notificações automáticas" },
      { text: "Autenticação JWT", subtext: "Implementando segurança na API" },
    ],
    troubleshooting: [
        { text: "Problemas de login", subtext: "Recupere sua conta e senha" },
        { text: "Tokens não funcionam", subtext: "Verifique configurações e validade" },
        { text: "Notificações não chegam", subtext: "Configure webhooks corretamente" },
    ]
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Central de Ajuda</h1>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="search"
            placeholder="Pesquisar na central de ajuda..."
            className="w-full p-4 pl-12 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-600 text-white p-6 rounded-lg flex items-center gap-4 transition-transform hover:scale-105">
          <Rocket size={32} />
          <div>
            <h3 className="font-bold text-lg">Primeiros Passos</h3>
            <p className="text-sm opacity-90">Aprenda a usar o sistema NPS do zero</p>
          </div>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg flex items-center gap-4 transition-transform hover:scale-105">
          <Youtube size={32} />
          <div>
            <h3 className="font-bold text-lg">Tutoriais em Vídeo</h3>
            <p className="text-sm opacity-90">Assista aos nossos tutoriais práticos</p>
          </div>
        </div>
        <div className="bg-purple-600 text-white p-6 rounded-lg flex items-center gap-4 transition-transform hover:scale-105">
          <Headset size={32} />
          <div>
            <h3 className="font-bold text-lg">Suporte Técnico</h3>
            <p className="text-sm opacity-90">Fale com nosso time de suporte</p>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Começando */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <PlayCircle className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Começando</h2>
            </div>
            <div className="space-y-2">
                {topics.gettingStarted.map(item => <HelpListItem key={item.text} {...item} />)}
            </div>
        </div>
        
        {/* Funcionalidades */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <Wand2 className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-bold text-gray-800">Funcionalidades</h2>
            </div>
            <div className="space-y-2">
                {topics.features.map(item => <HelpListItem key={item.text} {...item} />)}
            </div>
        </div>

        {/* API & Integrações */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <Code className="h-6 w-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-800">API & Integrações</h2>
            </div>
            <div className="space-y-2">
                {topics.api.map(item => <HelpListItem key={item.text} {...item} />)}
            </div>
        </div>

        {/* Solução de Problemas */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <Wrench className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">Solução de Problemas</h2>
            </div>
            <div className="space-y-2">
                {topics.troubleshooting.map(item => <HelpListItem key={item.text} {...item} />)}
            </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-12">
        <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Perguntas Frequentes</h2>
        </div>
        <FaqItem question="O que é NPS e como funciona?">
            <p>Net Promoter Score é uma métrica que mede a satisfação e lealdade dos clientes numa escala de 0 a 10.</p>
        </FaqItem>
        <FaqItem question="Como interpretar os resultados do NPS?">
            <p>Scores de 0-6 são detratores, 7-8 neutros e 9-10 promotores. NPS = % Promotores - % Detratores.</p>
        </FaqItem>
        <FaqItem question="Posso personalizar as pesquisas?">
            <p>Sim, você pode personalizar cores, textos, logotipos e campos adicionais nas pesquisas.</p>
        </FaqItem>
        <FaqItem question="Como exportar relatórios?">
            <p>Acesse o dashboard e clique no botão "Exportar" para baixar relatórios em PDF ou Excel.</p>
        </FaqItem>
      </div>

      {/* Still need help? */}
      <div className="text-center bg-gray-100 p-8 rounded-lg">
        <Cog size={40} className="mx-auto text-blue-600 mb-4 animate-spin" style={{ animationDuration: '10s' }} />
        <h2 className="text-2xl font-bold text-gray-800">Ainda precisa de ajuda?</h2>
        <p className="text-gray-600 mt-2 mb-6 max-w-lg mx-auto">Nossa equipe de suporte está sempre pronta para ajudar você</p>
        <div className="flex justify-center gap-4 flex-wrap">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all transform hover:scale-105 shadow-sm">
                <Mail size={18}/> Enviar Email
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all transform hover:scale-105 shadow-sm">
                <MessageSquare size={18}/> WhatsApp
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all transform hover:scale-105 shadow-sm">
                <MessageSquare size={18}/> Chat ao Vivo
            </button>
        </div>
      </div>
    </>
  );
} 