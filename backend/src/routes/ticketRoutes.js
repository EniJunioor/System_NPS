const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const validate = require('../middleware/validate');
const { ticketSchema, updateTicketSchema } = require('../validators/ticketSchemas');

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - descricao
 *         - data
 *         - hora
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do ticket
 *         descricao:
 *           type: string
 *           description: Descrição do problema
 *         data:
 *           type: string
 *           format: date-time
 *         hora:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [ABERTO, EM_ANDAMENTO, FINALIZADO, AGUARDANDO_ATENDIMENTO, AGUARDANDO_CLIENTE]
 *         criadoPor:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *         atendidoPor:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TicketStats:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total de tickets
 *         emAndamento:
 *           type: integer
 *           description: Tickets em andamento
 *         finalizados:
 *           type: integer
 *           description: Tickets finalizados
 *         cancelados:
 *           type: integer
 *           description: Tickets cancelados
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Listar todos os tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca textual no título e descrição do ticket
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ABERTO, EM_ANDAMENTO, FINALIZADO, AGUARDANDO_ATENDIMENTO, AGUARDANDO_CLIENTE, CANCELADO]
 *         description: Filtra tickets por status
 *       - in: query
 *         name: urgencia
 *         schema:
 *           type: string
 *           enum: [BAIXA, MEDIA, ALTA, CRITICA]
 *         description: Filtra tickets por urgência
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página para paginação
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de tickets por página
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Campo para ordenação
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordem da ordenação
 *     responses:
 *       200:
 *         description: Lista de tickets retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalTickets:
 *                   type: integer
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', async (req, res, next) => {
  const { search, status, urgencia, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: 'insensitive' } },
      { descricao: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (urgencia) where.urgencia = urgencia;

  // Filtro de visibilidade baseado no tipo de usuário
  if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'GESTOR') {
    where.atendidoPorId = req.user.id;
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        criadoPor: true,
        atendidoPor: true,
        token: true,
        avaliacao: true,
      },
      orderBy: {
        [sortBy]: order,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit, 10),
    });

    const totalTickets = await prisma.ticket.count({ where });

    res.json({
      tickets,
      totalPages: Math.ceil(totalTickets / limit),
      currentPage: parseInt(page, 10),
      totalTickets,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tickets/stats:
 *   get:
 *     summary: Obter estatísticas dos tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: "Filtra estatísticas por período (ex: '7d' para 7 dias, '30d' para 30 dias)"
 *       - in: query
 *         name: responsavelId
 *         schema:
 *           type: string
 *         description: Filtra estatísticas por ID do responsável
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketStats'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/stats', async (req, res, next) => {
  const { periodo, responsavelId } = req.query;

  const where = {};

  if (responsavelId) {
    where.atendidoPorId = responsavelId;
  }

  if (periodo) {
    const date = new Date();
    const days = parseInt(periodo.replace('d', ''), 10);
    date.setDate(date.getDate() - days);
    where.createdAt = { gte: date };
  }

  try {
    const total = await prisma.ticket.count({ where });
    const emAndamento = await prisma.ticket.count({ where: { ...where, status: 'EM_ANDAMENTO' } });
    const finalizados = await prisma.ticket.count({ where: { ...where, status: 'FINALIZADO' } });
    const cancelados = await prisma.ticket.count({ where: { ...where, status: 'CANCELADO' } });
    const abertos = await prisma.ticket.count({ where: { ...where, status: 'ABERTO' } });

    res.json({
      total,
      emAndamento,
      finalizados,
      cancelados,
      abertos
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Criar um novo ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - categoria
 *               - urgencia
 *               - data
 *               - hora
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categoria:
 *                 $ref: '#/components/schemas/TicketCategory'
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               urgencia:
 *                 $ref: '#/components/schemas/TicketUrgency'
 *               anexos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs dos anexos
 *               data:
 *                 type: string
 *                 format: date-time
 *               hora:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Ticket criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       500:
 *         description: Erro interno do servidor
 *       422:
 *         description: Erro de validação
 */
router.post('/', validate(ticketSchema), async (req, res, next) => {
  if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'GESTOR') {
    return res.status(403).json({ error: 'Apenas gestores ou administradores podem criar tickets' });
  }
  const { titulo, descricao, categoria, tags, urgencia, anexos, data, hora, reproSteps, expectedResult, deadline, notifyClient, markUrgent, autoAssign, atendidoPorId } = req.body;

  try {
    const ticket = await prisma.ticket.create({
      data: {
        titulo,
        descricao,
        categoria,
        tags,
        urgencia,
        anexos,
        data,
        hora,
        status: 'ABERTO',
        criadoPorId: req.user.id,
        atendidoPorId,
        reproSteps,
        expectedResult,
        deadline,
        notifyClient,
        markUrgent,
        autoAssign,
      },
    });

    // Gatilho de notificação: Notificar admins e gestores sobre novo ticket
    const adminsAndGestores = await prisma.user.findMany({
      where: {
        OR: [{ tipo: 'ADMIN' }, { tipo: 'GESTOR' }],
      },
      select: { id: true },
    });

    const notifications = adminsAndGestores.map(user => ({
      userId: user.id,
      type: 'NOVO_TICKET',
      message: `Novo Ticket #${ticket.id} criado por ${req.user.nome}: ${ticket.titulo}`,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Atualizar um ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               categoria:
 *                 $ref: '#/components/schemas/TicketCategory'
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               urgencia:
 *                 $ref: '#/components/schemas/TicketUrgency'
 *               anexos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs dos anexos
 *               data:
 *                 type: string
 *                 format: date-time
 *               hora:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [ABERTO, EM_ANDAMENTO, FINALIZADO, AGUARDANDO_ATENDIMENTO, AGUARDANDO_CLIENTE, CANCELADO]
 *               atendidoPorId:
 *                 type: string
 *                 description: ID do usuário que atenderá o ticket
 *     responses:
 *       200:
 *         description: Ticket atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket não encontrado
 *       500:
 *         description: Erro interno do servidor
 *       422:
 *         description: Erro de validação
 */
router.put('/:id', validate(updateTicketSchema), async (req, res, next) => {
  const { id } = req.params;
  const { titulo, descricao, categoria, tags, urgencia, anexos, data, hora, status, atendidoPorId, reproSteps, expectedResult, deadline, notifyClient, markUrgent, autoAssign } = req.body;

  try {
    const ticketAntes = await prisma.ticket.findUnique({
      where: { id: id },
    });

    if (!ticketAntes) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    const ticket = await prisma.ticket.update({
      where: { id: id },
      data: {
        titulo,
        descricao,
        categoria,
        tags,
        urgencia,
        anexos,
        data,
        hora,
        status,
        atendidoPorId,
        reproSteps,
        expectedResult,
        deadline,
        notifyClient,
        markUrgent,
        autoAssign,
      },
    });

    // Gatilho de notificação: Se o ticket foi atribuído a alguém (ou reatribuído)
    if (atendidoPorId && atendidoPorId !== ticketAntes.atendidoPorId) {
      await prisma.notification.create({
        data: {
          userId: atendidoPorId,
          type: 'TICKET_ATRIBUIDO',
          message: `Você foi atribuído ao Ticket #${ticket.id}: ${ticket.titulo}`,
        },
      });
    }

    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tickets/{id}/transfer:
 *   patch:
 *     summary: Transferir ticket para outro atendente
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               atendidoPorId:
 *                 type: string
 *                 description: Novo ID do atendente
 *     responses:
 *       200:
 *         description: Atendente transferido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Ticket não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id/transfer', async (req, res) => {
  const { id } = req.params;
  const { atendidoPorId } = req.body;
  try {
    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return res.status(404).json({ error: 'Ticket não encontrado' });
    // Só pode transferir se for admin/gestor ou atendente atual
    if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'GESTOR' && ticket.atendidoPorId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para transferir este ticket' });
    }
    const updated = await prisma.ticket.update({
      where: { id },
      data: { atendidoPorId },
      include: {
        criadoPor: true,
        atendidoPor: true,
        token: true,
        avaliacao: true,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error('Erro ao transferir ticket:', error);
    res.status(500).json({ error: 'Erro ao transferir ticket' });
  }
});

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Obter um ticket pelo ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ticket
 *     responses:
 *       200:
 *         description: Ticket retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: id },
      include: {
        criadoPor: true,
        atendidoPor: true,
        token: true,
        avaliacao: true,
        tarefas: true,
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }
    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Deletar um ticket pelo ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ticket
 *     responses:
 *       204:
 *         description: Ticket deletado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.ticket.delete({
      where: { id: id },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router; 