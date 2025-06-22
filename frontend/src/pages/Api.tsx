import {
  Link,
  ShieldCheck,
  GitBranch,
  CircleDot,
  ClipboardCopy,
  Key,
  CheckCircle,
  ListChecks,
  ClipboardList,
  Check
} from "lucide-react";
import { useState } from "react";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Componente para copiar texto
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copied) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-600/50 transition-colors" disabled={copied}>
       {copied ? (
        <Check size={16} className="text-green-400" />
      ) : (
        <ClipboardCopy size={16} className="text-gray-300" />
      )}
    </button>
  );
};

// Componente para exibir um endpoint
const Endpoint = ({ method, path, description, request, response }: { method: HttpMethod, path: string, description: string, request?: string, response?: string }) => {
  const methodColors = {
    GET: 'bg-blue-100 text-blue-800 border-blue-300',
    POST: 'bg-green-100 text-green-800 border-green-300',
    PUT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    DELETE: 'bg-red-100 text-red-800 border-red-300',
    PATCH: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  };
  return (
    <div className="border-t border-gray-200 py-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className={`px-3 py-1 text-sm font-semibold rounded-md border ${methodColors[method]}`}>{method}</span>
        <span className="font-mono text-gray-800">{path}</span>
        <span className="text-gray-600">- {description}</span>
      </div>
      {(request || response) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {request && (
            <div>
              <p className="font-semibold text-sm mb-1 text-gray-700">Request:</p>
              <pre className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 relative whitespace-pre-wrap">
                <CopyButton text={request} />
                <code>{request}</code>
              </pre>
            </div>
          )}
          {response && (
            <div>
              <p className="font-semibold text-sm mb-1 text-gray-700">Response:</p>
              <pre className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 relative whitespace-pre-wrap">
                <CopyButton text={response} />
                <code>{response}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Dados dos endpoints
const endpointGroups = [
  {
    name: 'Autenticação',
    icon: <Key size={20} className="text-purple-600" />,
    routes: [
      { method: 'POST', path: '/auth/login', desc: 'Login do usuário', request: JSON.stringify({ email: 'user@exemplo.com', senha: '123' }, null, 2), response: JSON.stringify({ user: { id: '1', nome: 'João' }, token: 'Jwt_token_aqui' }, null, 2) },
      { method: 'POST', path: '/auth/register', desc: 'Registrar novo usuário', request: JSON.stringify({ nome: "João", email: "user@exemplo.com", senha: "123" }, null, 2), response: JSON.stringify({ user: { id: "2", nome: "João" }, token: "novo_jwt_token" }, null, 2) },
      { method: 'GET', path: '/auth/users', desc: 'Listar usuários (protegido)', request: "N/A (sem corpo de requisição)", response: JSON.stringify([{ id: "1", nome: "João" }, { id: "2", nome: "Maria" }], null, 2) }
    ] as const,
  },
  {
    name: 'Tokens de Avaliação',
    icon: <CheckCircle size={20} className="text-purple-600" />,
    routes: [
      { method: 'POST', path: '/tokens', desc: 'Gerar token de avaliação', request: JSON.stringify({ telefone: "11999999999", atendente: "Maria" }, null, 2), response: JSON.stringify({ valor: "xyz789", expiraEm: "2024-07-01T10:00:00Z" }, null, 2) },
      { method: 'GET', path: '/tokens/:id', desc: 'Consultar token', request: "N/A (sem corpo de requisição)", response: JSON.stringify({ valor: "xyz789", usado: false, expiraEm: "2024-07-01T10:00:00Z" }, null, 2) },
      { method: 'PUT', path: '/tokens/:id', desc: 'Invalidar token', request: JSON.stringify({ usado: true }, null, 2), response: JSON.stringify({ valor: "xyz789", usado: true }, null, 2) }
    ] as const,
  },
  {
    name: 'Avaliações',
    icon: <ListChecks size={20} className="text-purple-600" />,
    routes: [
      { method: 'POST', path: '/avaliacoes', desc: 'Criar avaliação', request: JSON.stringify({ nota: 10, comentario: "Ótimo!", token: "xyz789" }, null, 2), response: JSON.stringify({ id: "eval-1", nota: 10, status: "RECEBIDA" }, null, 2) },
      { method: 'GET', path: '/avaliacoes/stats', desc: 'Obter estatísticas do NPS', request: "N/A (sem corpo de requisição)", response: JSON.stringify({ total: 150, promotores: 100, detratores: 10, nps: 60 }, null, 2) }
    ] as const,
  },
  {
    name: 'Tickets',
    icon: <ClipboardList size={20} className="text-purple-600" />,
    routes: [
      { method: 'GET', path: '/tickets', desc: 'Listar tickets', request: "N/A (sem corpo de requisição)", response: JSON.stringify([{ id: "tkt-1", assunto: "Problema com login", status: "ABERTO" }], null, 2) },
      { method: 'POST', path: '/tickets', desc: 'Criar novo ticket', request: JSON.stringify({ assunto: "Não consigo resetar a senha", detalhes: "O link de reset não chega no meu email." }, null, 2), response: JSON.stringify({ id: "tkt-2", status: "ABERTO" }, null, 2) },
      { method: 'GET', path: '/tickets/:id', desc: 'Obter ticket por ID', request: "N/A (sem corpo de requisição)", response: JSON.stringify({ id: "tkt-1", assunto: "Problema com login", status: "ABERTO", historico: [] }, null, 2) },
      { method: 'PUT', path: '/tickets/:id', desc: 'Atualizar ticket', request: JSON.stringify({ status: "FECHADO", resolucao: "Problema resolvido." }, null, 2), response: JSON.stringify({ id: "tkt-1", status: "FECHADO" }, null, 2) }
    ] as const,
  },
   {
    name: 'Tarefas',
    icon: <ListChecks size={20} className="text-purple-600" />,
    routes: [
      { method: 'GET', path: '/tasks', desc: 'Listar tarefas', request: "N/A (sem corpo de requisição)", response: JSON.stringify([{ id: "task-1", descricao: "Verificar API", completa: false }], null, 2) },
      { method: 'POST', path: '/tasks', desc: 'Criar nova tarefa', request: JSON.stringify({ descricao: "Preparar relatório mensal" }, null, 2), response: JSON.stringify({ id: "task-2", descricao: "Preparar relatório mensal", completa: false }, null, 2) },
      { method: 'GET', path: '/tasks/:id', desc: 'Obter tarefa por ID', request: "N/A (sem corpo de requisição)", response: JSON.stringify({ id: "task-1", descricao: "Verificar API", completa: false }, null, 2) },
      { method: 'PATCH', path: '/tasks/:id/complete', desc: 'Marcar como concluída', request: JSON.stringify({ completa: true }, null, 2), response: JSON.stringify({ id: "task-1", completa: true }, null, 2) },
      { method: 'DELETE', path: '/tasks/:id', desc: 'Excluir tarefa', request: "N/A (sem corpo de requisição)", response: JSON.stringify({ message: "Tarefa excluída com sucesso" }, null, 2) }
    ] as const,
  }
];

export default function Api() {
  const curlExample = `curl -X POST https://suaapi.com/auth/login -H "Content-Type: application/json" -d '{"email":"user@exemplo.com", "senha":"123456"}'`;
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">API & Integrações</h1>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-100">
            <Link className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Base URL</p>
            <p className="font-semibold text-gray-800">https://suaapi.com</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-100">
            <GitBranch className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Versão</p>
            <p className="font-semibold text-gray-800">v1.0</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100">
            <CircleDot className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-semibold text-green-600">Em produção</p>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
        <p className="text-gray-700">
          Esta API permite integração total com o sistema NPS, incluindo autenticação, tickets, tarefas, avaliações e notificações.
        </p>
      </div>

      {/* Autenticação */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">Autenticação</h2>
        </div>
        <p className="text-gray-700 mb-4">Utilize JWT no header <code className="bg-gray-200 px-1 py-0.5 rounded-md">Authorization</code> para acessar endpoints protegidos.</p>
        <pre className="bg-gray-100 p-3 rounded-md text-sm text-gray-800 mb-4"><code>Authorization: Bearer seu_token_jwt</code></pre>
        <p className="text-gray-700 mb-2">Exemplo de login via cURL:</p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded-md text-sm relative whitespace-pre-wrap">
          <CopyButton text={curlExample} />
          <code>{curlExample}</code>
        </pre>
      </div>

      {/* Endpoints */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Endpoints Principais</h2>
        
        {endpointGroups.map((group) => (
          <div key={group.name} className="mb-6 last:mb-0">
            <div className="flex items-center gap-3 mt-4">
              {group.icon}
              <h3 className="text-lg font-semibold text-gray-700">{group.name}</h3>
            </div>
            {group.routes.map((route) => (
              <Endpoint key={`${route.method}-${route.path}`} method={route.method} path={route.path} description={route.desc} request={route.request} response={route.response} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
} 