const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para obter métricas e dados do dashboard
 */

/**
 * @swagger
 * /dashboard/metrics:
 *   get:
 *     summary: Retorna métricas gerais do sistema
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 activeUsers:
 *                   type: integer
 *                 tokensGenerated:
 *                   type: integer
 *                 tokensUsed:
 *                   type: integer
 *                 totalTickets:
 *                   type: integer
 *                 pendingTickets:
 *                   type: integer
 *                 resolvedTickets:
 *                   type: integer
 *                 urgentTickets:
 *                   type: integer
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/metrics', authenticateToken, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    // A definição de "usuário ativo" pode variar. Aqui, consideramos usuários que criaram ou atenderam um ticket nos últimos 30 dias.
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    const activeUsersCount = await prisma.user.count({
      where: {
        OR: [
          { ticketsCriados: { some: { createdAt: { gte: thirtyDaysAgo } } } },
          { ticketsAtendidos: { some: { createdAt: { gte: thirtyDaysAgo } } } },
        ],
      },
    });
    
    const tokensGenerated = await prisma.token.count();
    const tokensUsed = await prisma.token.count({ where: { usado: true } });

    // Novas métricas de tickets
    const totalTickets = await prisma.ticket.count();
    const pendingTickets = await prisma.ticket.count({ where: { status: 'ABERTO' } });
    const resolvedTickets = await prisma.ticket.count({ where: { status: 'FINALIZADO' } });
    const urgentTickets = await prisma.ticket.count({ where: { OR: [ { priority: 'alta' }, { priority: 'urgente' } ] } });

    res.json({
      totalUsers,
      activeUsers: activeUsersCount,
      tokensGenerated,
      tokensUsed,
      totalTickets,
      pendingTickets,
      resolvedTickets,
      urgentTickets
    });
  } catch (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas do dashboard' });
  }
});

/**
 * @swagger
 * /dashboard/performance-data:
 *   get:
 *     summary: Retorna dados de performance para gráficos
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month]
 *           default: week
 *         description: Período para agrupar os dados (semana ou mês)
 *     responses:
 *       200:
 *         description: Dados de performance retornados com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/performance-data', authenticateToken, async (req, res) => {
    // Esta é uma implementação de exemplo. Para um agrupamento por dia/semana/mês real em produção,
    // seria melhor usar queries SQL nativas com `groupBy` de data, o que é mais performático.
    // O Prisma suporta isso com `prisma.$queryRaw`.
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Últimos 30 dias
        },
      },
      select: { createdAt: true, status: true },
    });

    // Agrupamento simples em código (não ideal para grandes volumes de dados)
    const performanceData = tickets.reduce((acc, ticket) => {
      const date = ticket.createdAt.toISOString().split('T')[0]; // Agrupa por dia
      if (!acc[date]) {
        acc[date] = { created: 0, completed: 0 };
      }
      acc[date].created += 1;
      if (ticket.status === 'FINALIZADO') {
        acc[date].completed += 1;
      }
      return acc;
    }, {});

    res.json(performanceData);
  } catch (error)
    {
    console.error('Erro ao buscar dados de performance:', error);
    res.status(500).json({ error: 'Erro ao buscar dados de performance' });
  }
});

/**
 * @swagger
 * /dashboard/activity/recent:
 *   get:
 *     summary: Retorna um feed de atividades recentes do sistema
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feed de atividades retornado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/activity/recent', authenticateToken, async (req, res) => {
  try {
    const recentTickets = await prisma.ticket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { criadoPor: true, atendidoPor: true },
    });

    const recentTasks = await prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { criadoPor: true, responsavel: true },
    });

    const activityFeed = [
      ...recentTickets.map(t => ({ type: 'TICKET', data: t, timestamp: t.createdAt })),
      ...recentTasks.map(t => ({ type: 'TASK', data: t, timestamp: t.createdAt })),
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    res.json(activityFeed);
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    res.status(500).json({ error: 'Erro ao buscar atividades recentes' });
  }
});


module.exports = router; 