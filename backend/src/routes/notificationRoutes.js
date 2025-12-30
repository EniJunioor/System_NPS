const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Notificações
 *   description: Endpoints para gerenciar notificações
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lista as notificações do usuário logado
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: Filtra por status de leitura (lida/não lida)
 *     responses:
 *       200:
 *         description: Lista de notificações retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', authenticateToken, async (req, res) => {
  const { page = 1, limit = 10, read } = req.query;
  const where = {
      userId: req.user.id,
  };

  if (read !== undefined) {
    where.read = read === 'true';
  }

  try {
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit, 10),
    });

    const totalNotifications = await prisma.notification.count({ where });

    res.json({
      notifications,
      totalPages: Math.ceil(totalNotifications / limit),
      currentPage: parseInt(page, 10),
      totalNotifications,
    });
  } catch (error) {
    console.error('Erro ao listar notificações:', error);
    res.status(500).json({ error: 'Erro ao listar notificações' });
  }
});

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Marca uma notificação como lida
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da notificação
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *       403:
 *         description: Não autorizado a modificar esta notificação
 *       404:
 *         description: Notificação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id/read', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    if (notification.userId !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json(updatedNotification);
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ error: 'Erro ao marcar notificação como lida' });
  }
});

module.exports = router; 