import React, { useState } from 'react';
import { MessageCircle, Send, User, Bot, Search, Phone, MoreHorizontal, Paperclip, Video } from 'lucide-react';

interface Message {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  sent: boolean;
}

const conversations = [
  { id: 1, name: 'João Silva', message: 'Oi! Como está o projeto?', time: '14:30', avatar: 'https://i.pravatar.cc/150?u=joao', unread: 0, online: true, active: true },
  { id: 2, name: 'Maria Santos', message: 'Vou enviar os arquivos agora', time: '13:45', avatar: 'https://i.pravatar.cc/150?u=maria', unread: 0, online: false },
  { id: 3, name: 'Equipe Desenvolvimento', message: 'Carlos: Reunião às 15h', time: '12:20', avatar: 'https://i.pravatar.cc/150?u=equipe', unread: 3, online: true, isGroup: true },
  { id: 4, name: 'Pedro Costa', message: 'Obrigado pela ajuda!', time: '11:15', avatar: 'https://i.pravatar.cc/150?u=pedro', unread: 0, online: false },
];

const messages: Message[] = [
    { id: 1, user: 'João Silva', avatar: 'https://i.pravatar.cc/150?u=joao', text: 'Oi! Como está o andamento do projeto? Preciso de uma atualização sobre o status.', time: '14:30', sent: false },
    { id: 2, user: 'Você', avatar: 'https://i.pravatar.cc/150?u=eu', text: 'Olá João! O projeto está indo bem. Estamos na fase final de testes. Devo ter uma versão para revisão até amanhã.', time: '14:32', sent: true },
    { id: 3, user: 'João Silva', avatar: 'https://i.pravatar.cc/150?u=joao', text: 'Perfeito! Vou aguardar então. Se precisar de alguma coisa, me avise.', time: '14:33', sent: false },
];

const Chat = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
        <p className="text-gray-500">Converse com sua equipe e colaboradores</p>
      </div>

      <div className="flex-1 flex bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Conversation List */}
        <div className="w-90 flex-shrink-0 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="search" placeholder="Buscar conversas..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(convo => (
              <div key={convo.id} className={`flex items-center p-3 cursor-pointer transition-colors ${convo.active ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                <div className="relative">
                  <img src={convo.avatar} alt={convo.name} className="w-12 h-12 rounded-full" />
                  {convo.online && !convo.isGroup && <span className="absolute bottom-0 right-0 block h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>}
                </div>
                <div className="flex-1 ml-3">
                  <p className="font-semibold text-gray-800">{convo.name}</p>
                  <p className="text-sm text-gray-600 truncate">{convo.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{convo.time}</p>
                  {convo.unread > 0 && <span className="mt-1 inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{convo.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className='flex items-center'>
                  <div className="relative">
                      <img src={conversations[0].avatar} alt={conversations[0].name} className="w-10 h-10 rounded-full" />
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="ml-3">
                      <p className="font-semibold">{conversations[0].name}</p>
                      <p className="text-xs text-green-500">Online</p>
                  </div>
              </div>
            <div className="flex items-center gap-4 text-gray-500">
              <Phone size={20} className="cursor-pointer hover:text-gray-800" />
              <Video size={20} className="cursor-pointer hover:text-gray-800" />
              <MoreHorizontal size={20} className="cursor-pointer hover:text-gray-800" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="space-y-6">
              {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-3 ${msg.sent ? 'justify-end' : ''}`}>
                  {!msg.sent && <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full" />}
                  <div className={`max-w-md p-3 rounded-lg ${msg.sent ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sent ? 'text-purple-100/80' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                  {msg.sent && <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full" />}
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Paperclip size={20} className="text-gray-500 cursor-pointer hover:text-gray-800" />
              <input type="text" placeholder="Digite sua mensagem..." className="flex-1 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none" />
              <button className="p-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white rounded-lg transition-all">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 