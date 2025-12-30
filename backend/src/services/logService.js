const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LogService {
  /**
   * Cria um log de ação do usuário
   * @param {Object} logData - Dados do log
   * @param {string} logData.userId - ID do usuário que realizou a ação
   * @param {string} logData.action - Tipo de ação (CREATE, UPDATE, DELETE, etc.)
   * @param {string} logData.entity - Nome da entidade afetada (Ticket, Task, User, etc.)
   * @param {string} logData.entityId - ID da entidade afetada (opcional)
   * @param {string} logData.description - Descrição da ação
   * @param {Object} logData.details - Detalhes adicionais em formato JSON (opcional)
   * @param {string} logData.ipAddress - Endereço IP do usuário (opcional)
   * @param {string} logData.userAgent - User Agent do navegador (opcional)
   */
  static async createLog({
    userId,
    action,
    entity,
    entityId = null,
    description,
    details = null,
    ipAddress = null,
    userAgent = null,
  }) {
    try {
      const log = await prisma.log.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          description,
          details: details ? JSON.parse(JSON.stringify(details)) : null,
          ipAddress,
          userAgent,
        },
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              email: true,
              tipo: true,
            },
          },
        },
      });

      return log;
    } catch (error) {
      console.error('Erro ao criar log:', error);
      // Não lançar erro para não quebrar o fluxo principal
      return null;
    }
  }

  /**
   * Lista logs com filtros e paginação
   * @param {Object} filters - Filtros de busca
   * @param {string} filters.userId - Filtrar por ID do usuário
   * @param {string} filters.action - Filtrar por tipo de ação
   * @param {string} filters.entity - Filtrar por entidade
   * @param {string} filters.entityId - Filtrar por ID da entidade
   * @param {Date} filters.startDate - Data de início
   * @param {Date} filters.endDate - Data de fim
   * @param {number} filters.page - Página atual
   * @param {number} filters.limit - Itens por página
   */
  static async getLogs(filters = {}) {
    try {
      const {
        userId,
        action,
        entity,
        entityId,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = filters;

      const where = {};

      if (userId) where.userId = userId;
      if (action) where.action = action;
      if (entity) where.entity = entity;
      if (entityId) where.entityId = entityId;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        prisma.log.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.log.count({ where }),
      ]);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      throw error;
    }
  }

  /**
   * Busca um log específico por ID
   */
  static async getLogById(logId) {
    try {
      const log = await prisma.log.findUnique({
        where: { id: logId },
        include: {
          user: {
            select: {
              id: true,
              nome: true,
              email: true,
              tipo: true,
            },
          },
        },
      });

      return log;
    } catch (error) {
      console.error('Erro ao buscar log:', error);
      throw error;
    }
  }

  /**
   * Deleta logs antigos (útil para manutenção)
   * @param {Date} olderThan - Deletar logs mais antigos que esta data
   */
  static async deleteOldLogs(olderThan) {
    try {
      const result = await prisma.log.deleteMany({
        where: {
          createdAt: {
            lt: new Date(olderThan),
          },
        },
      });

      return result;
    } catch (error) {
      console.error('Erro ao deletar logs antigos:', error);
      throw error;
    }
  }
}

module.exports = LogService;

