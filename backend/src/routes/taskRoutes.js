const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const validate = require('../middleware/validate');
const { taskSchema, updateTaskSchema } = require('../validators/taskSchemas');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - duracao
 *         - descricao
 *         - tag
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da tarefa
 *         duracao:
 *           type: string
 *           description: 'Duração da tarefa (ex: 2h, 45min)'
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da tarefa
 *         tag:
 *           type: string
 *           enum: [TREINAMENTO, IMPLANTACAO, SUPORTE_TECNICO, DESENVOLVIMENTO, MANUTENCAO]
 *           description: Categoria da tarefa
 *         status:
 *           type: string
 *           enum: [PENDENTE, EM_ANDAMENTO, CONCLUIDA, CANCELADA]
 *           description: Status atual da tarefa
 *         sistema:
 *           type: string
 *           description: Nome do sistema relacionado (opcional)
 *         criadoPor:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             nome:
 *               type: string
 *             email:
 *               type: string
 *         responsavel:
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
 *         videoUrl:
 *           type: string
 *           description: Link de vídeo para implantação/treinamento (opcional)
 *     TaskStats:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total de tarefas
 *         pendentes:
 *           type: integer
 *           description: Tarefas pendentes
 *         emAndamento:
 *           type: integer
 *           description: Tarefas em andamento
 *         concluidas:
 *           type: integer
 *           description: Tarefas concluídas
 *         canceladas:
 *           type: integer
 *           description: Tarefas canceladas
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Listar todas as tarefas
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca textual no título e descrição da tarefa
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, EM_ANDAMENTO, CONCLUIDA, CANCELADA, EM_ESPERA]
 *         description: Filtra tarefas por status
 *       - in: query
 *         name: prioridade
 *         schema:
 *           type: string
 *           enum: [BAIXA, MEDIA, ALTA]
 *         description: Filtra tarefas por prioridade
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *           enum: [TREINAMENTO, IMPLANTACAO, SUPORTE_TECNICO, DESENVOLVIMENTO, MANUTENCAO, DOCUMENTACAO, REUNIAO]
 *         description: Filtra tarefas por tag
 *       - in: query
 *         name: sistema
 *         schema:
 *           type: string
 *         description: Filtra tarefas por sistema
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
 *         description: Quantidade de tarefas por página
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
 *         description: Lista de tarefas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 totalPages:
 *                   type: integer
 *                   description: Total de páginas
 *                 currentPage:
 *                   type: integer
 *                   description: Página atual
 *                 totalTasks:
 *                   type: integer
 *                   description: Total de tarefas
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', async (req, res, next) => {
  const { search, status, prioridade, tag, sistema, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

  const where = {};

  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: 'insensitive' } },
      { descricao: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) where.status = status;
  if (prioridade) where.prioridade = prioridade;
  if (tag) where.tag = tag;
  if (sistema) where.sistema = { contains: sistema, mode: 'insensitive' };


  if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'GESTOR') {
    where.responsavelId = req.user.id;
  }

  try {
    const tasks = await prisma.task.findMany({
      where,
      include: {
        criadoPor: { select: { id: true, nome: true, email: true } },
        responsavel: { select: { id: true, nome: true, email: true } },
      },
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: parseInt(limit, 10),
    });

    const totalTasks = await prisma.task.count({ where });

    res.json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: parseInt(page, 10),
      totalTasks,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks/stats:
 *   get:
 *     summary: Obter estatísticas das tarefas
 *     tags: [Tarefas]
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
 *               $ref: '#/components/schemas/TaskStats'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/stats', async (req, res, next) => {
  const { periodo, responsavelId } = req.query;

  const where = {};

  if (responsavelId) {
    where.responsavelId = responsavelId;
  }

  if (periodo) {
    const date = new Date();
    const days = parseInt(periodo.replace('d', ''), 10);
    date.setDate(date.getDate() - days);
    where.createdAt = { gte: date };
  }

  try {
    const total = await prisma.task.count({ where });
    const pendentes = await prisma.task.count({ where: { ...where, status: 'PENDENTE' } });
    const emAndamento = await prisma.task.count({ where: { ...where, status: 'EM_ANDAMENTO' } });
    const concluidas = await prisma.task.count({ where: { ...where, status: 'CONCLUIDA' } });
    const canceladas = await prisma.task.count({ where: { ...where, status: 'CANCELADA' } });

    res.json({
      total,
      pendentes,
      emAndamento,
      concluidas,
      canceladas,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Criar uma nova tarefa
 *     tags: [Tarefas]
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
 *               - duracao
 *               - descricao
 *               - tag
 *             properties:
 *               titulo:
 *                 type: string
 *               duracao:
 *                 type: string
 *                 description: 'Duração da tarefa (ex: 2h, 45min)'
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada da tarefa
 *                 minLength: 10
 *               tag:
 *                 $ref: '#/components/schemas/TaskTag'
 *               prioridade:
 *                 $ref: '#/components/schemas/TaskPriority'
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               dataVencimento:
 *                 type: string
 *                 format: date-time
 *               projeto:
 *                 type: string
 *               sistema:
 *                 type: string
 *                 description: Nome do sistema relacionado (opcional)
 *               responsavelId:
 *                 type: string
 *                 description: ID do usuário responsável (opcional)
 *               ticketId:
 *                 type: string
 *                 description: ID do ticket relacionado (opcional)
 *               anexos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs dos anexos
 *               videoUrl:
 *                 type: string
 *                 description: Link de vídeo para implantação/treinamento (opcional)
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Erro interno do servidor
 *       422:
 *         description: Erro de validação
 */
router.post('/', validate(taskSchema), async (req, res, next) => {
  if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'GESTOR') {
    return res.status(403).json({ error: 'Apenas gestores ou administradores podem criar tarefas' });
  }
  const {
    titulo,
    duracao,
    descricao,
    tag,
    prioridade,
    dataInicio,
    dataVencimento,
    projeto,
    sistema,
    responsavelId,
    ticketId,
    anexos,
    videoUrl,
  } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        titulo,
        duracao,
        descricao,
        tag,
        prioridade,
        dataInicio,
        dataVencimento,
        projeto,
        sistema,
        videoUrl,
        anexos,
        responsavelId: responsavelId || null,
        ticketId: ticketId || null,
        criadoPorId: req.user.id,
      },
      include: {
        criadoPor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualizar uma tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               duracao:
 *                 type: string
 *                 description: 'Duração da tarefa (ex: 2h, 45min)'
 *               descricao:
 *                 type: string
 *                 description: Descrição detalhada da tarefa
 *               tag:
 *                 $ref: '#/components/schemas/TaskTag'
 *               status:
 *                 $ref: '#/components/schemas/TaskStatus'
 *               prioridade:
 *                 $ref: '#/components/schemas/TaskPriority'
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               dataVencimento:
 *                 type: string
 *                 format: date-time
 *               projeto:
 *                 type: string
 *               sistema:
 *                 type: string
 *                 description: Nome do sistema relacionado (opcional)
 *               responsavelId:
 *                 type: string
 *                 description: ID do usuário responsável (opcional)
 *               ticketId:
 *                 type: string
 *                 description: ID do ticket relacionado (opcional)
 *               anexos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs dos anexos
 *               videoUrl:
 *                 type: string
 *                 description: Link de vídeo para implantação/treinamento (opcional)
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno do servidor
 *       422:
 *         description: Erro de validação
 */
router.put('/:id', validate(updateTaskSchema), async (req, res, next) => {
  const { id } = req.params;
  const {
    titulo,
    duracao,
    descricao,
    tag,
    status,
    prioridade,
    dataInicio,
    dataVencimento,
    projeto,
    sistema,
    responsavelId,
    ticketId,
    anexos,
    videoUrl,
  } = req.body;

  try {
    const taskAntes = await prisma.task.findUnique({ where: { id: id }});

    const task = await prisma.task.update({
      where: { id: id },
      data: {
        titulo,
        duracao,
        descricao,
        tag,
        status,
        prioridade,
        dataInicio,
        dataVencimento,
        projeto,
        sistema,
        responsavelId,
        ticketId,
        anexos,
        videoUrl,
      },
    });

    // Gatilho de notificação: Se a tarefa foi atribuída a alguém (ou reatribuída)
    if (responsavelId && responsavelId !== taskAntes.responsavelId) {
      await prisma.notification.create({
        data: {
          userId: responsavelId,
          type: 'TAREFA_ATRIBUIDA',
          message: `Você foi atribuído à Tarefa #${task.id}: ${task.titulo}`,
        },
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Excluir uma tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id },
    });
    res.json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tasks/{id}/transfer:
 *   patch:
 *     summary: Transferir tarefa para outro responsável
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               responsavelId:
 *                 type: string
 *                 description: Novo ID do responsável
 *     responses:
 *       200:
 *         description: Responsável transferido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       403:
 *         description: Não autorizado
 *       404:
 *         description: Tarefa não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id/transfer', async (req, res) => {
  const { id } = req.params;
  const { responsavelId } = req.body;
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
    // Só pode transferir se for admin/gestor ou responsável atual
    if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'GESTOR' && task.responsavelId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para transferir esta tarefa' });
    }
    const updated = await prisma.task.update({
      where: { id },
      data: { responsavelId },
      include: {
        criadoPor: { select: { id: true, nome: true, email: true } },
        responsavel: { select: { id: true, nome: true, email: true } },
      },
    });
    res.json(updated);
  } catch (error) {
    console.error('Erro ao transferir tarefa:', error);
    res.status(500).json({ error: 'Erro ao transferir tarefa' });
  }
});

module.exports = router; 