const LogService = require('../services/logService');

/**
 * Middleware para registrar logs de ações do usuário
 * Deve ser usado após o middleware de autenticação
 */
function loggingMiddleware(req, res, next) {
  // Salvar a função original de res.json
  const originalJson = res.json.bind(res);

  // Sobrescrever res.json para interceptar a resposta
  res.json = function (data) {
    // Registrar o log apenas se a requisição foi bem-sucedida (status 2xx)
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      // Extrair informações da requisição
      const action = getActionFromMethod(req.method);
      const entity = getEntityFromPath(req.path);
      const entityId = req.params.id || req.params.ticketId || req.params.taskId || null;
      const description = generateDescription(req, action, entity, entityId);

      // Criar log de forma assíncrona (não bloqueia a resposta)
      LogService.createLog({
        userId: req.user.id,
        action,
        entity,
        entityId,
        description,
        details: {
          method: req.method,
          path: req.path,
          query: req.query,
          statusCode: res.statusCode,
        },
        ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
        userAgent: req.headers['user-agent'],
      }).catch((error) => {
        // Log do erro, mas não quebra a resposta
        console.error('Erro ao registrar log:', error);
      });
    }

    // Chamar a função original
    return originalJson(data);
  };

  next();
}

/**
 * Determina o tipo de ação baseado no método HTTP
 */
function getActionFromMethod(method) {
  const actionMap = {
    GET: 'VIEW',
    POST: 'CREATE',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE',
  };

  return actionMap[method] || 'OTHER';
}

/**
 * Extrai o nome da entidade do path da requisição
 */
function getEntityFromPath(path) {
  // Remove barras iniciais e finais, e pega a primeira parte
  const parts = path.split('/').filter((p) => p && !p.match(/^\d+$/));
  
  if (parts.length === 0) return 'Unknown';
  
  const entityMap = {
    tickets: 'Ticket',
    tasks: 'Task',
    auth: 'Auth',
    users: 'User',
    tokens: 'Token',
    avaliacoes: 'Avaliacao',
    dashboard: 'Dashboard',
    notifications: 'Notification',
    upload: 'Upload',
  };

  const key = parts[0].toLowerCase();
  return entityMap[key] || parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
}

/**
 * Gera uma descrição legível da ação
 */
function generateDescription(req, action, entity, entityId) {
  const user = req.user ? `${req.user.nome} (${req.user.email})` : 'Usuário desconhecido';
  
  const actionDescriptions = {
    CREATE: `Criou um novo ${entity}`,
    UPDATE: `Atualizou ${entity}${entityId ? ` #${entityId}` : ''}`,
    DELETE: `Deletou ${entity}${entityId ? ` #${entityId}` : ''}`,
    VIEW: `Visualizou ${entity}${entityId ? ` #${entityId}` : 's'}`,
    LOGIN: 'Fez login no sistema',
    LOGOUT: 'Fez logout do sistema',
    DOWNLOAD: `Baixou arquivo de ${entity}${entityId ? ` #${entityId}` : ''}`,
    UPLOAD: `Fez upload de arquivo para ${entity}${entityId ? ` #${entityId}` : ''}`,
    EXPORT: `Exportou dados de ${entity}`,
    ASSIGN: `Atribuiu ${entity}${entityId ? ` #${entityId}` : ''}`,
    TRANSFER: `Transferiu ${entity}${entityId ? ` #${entityId}` : ''}`,
    COMPLETE: `Finalizou ${entity}${entityId ? ` #${entityId}` : ''}`,
    CANCEL: `Cancelou ${entity}${entityId ? ` #${entityId}` : ''}`,
    OTHER: `Realizou ação em ${entity}`,
  };

  const description = actionDescriptions[action] || `Realizou ação em ${entity}`;
  
  return `${user}: ${description}`;
}

/**
 * Middleware específico para registrar ações customizadas
 * Use este quando precisar de mais controle sobre o log
 */
function createCustomLog(action, entity, descriptionGenerator) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const entityId = req.params.id || req.params.ticketId || req.params.taskId || null;
        const description = descriptionGenerator 
          ? descriptionGenerator(req, data) 
          : `${req.user.nome}: ${action} ${entity}${entityId ? ` #${entityId}` : ''}`;

        LogService.createLog({
          userId: req.user.id,
          action,
          entity,
          entityId,
          description,
          details: {
            method: req.method,
            path: req.path,
            body: req.body,
            statusCode: res.statusCode,
          },
          ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
          userAgent: req.headers['user-agent'],
        }).catch((error) => {
          console.error('Erro ao registrar log customizado:', error);
        });
      }

      return originalJson(data);
    };

    next();
  };
}

module.exports = {
  loggingMiddleware,
  createCustomLog,
};

