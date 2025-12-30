const express = require('express');
const router = express.Router();
const LogService = require('../services/logService');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Log:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         action:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW, DOWNLOAD, UPLOAD, EXPORT, ASSIGN, TRANSFER, COMPLETE, CANCEL, OTHER]
 *         entity:
 *           type: string
 *         entityId:
 *           type: string
 *         description:
 *           type: string
 *         details:
 *           type: object
 *         ipAddress:
 *           type: string
 *         userAgent:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Lista logs do sistema
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrar por ID do usuário
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW, DOWNLOAD, UPLOAD, EXPORT, ASSIGN, TRANSFER, COMPLETE, CANCEL, OTHER]
 *         description: Filtrar por tipo de ação
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *         description: Filtrar por entidade
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *         description: Filtrar por ID da entidade
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data de início
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data de fim
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Log'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Apenas ADMIN e GESTOR podem ver todos os logs
    // Outros usuários só veem seus próprios logs
    const filters = { ...req.query };
    
    if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'GESTOR') {
      filters.userId = req.user.id;
    }

    const result = await LogService.getLogs(filters);
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

/**
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: Busca um log específico
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do log
 *     responses:
 *       200:
 *         description: Log encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Log'
 *       404:
 *         description: Log não encontrado
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const log = await LogService.getLogById(req.params.id);

    if (!log) {
      return res.status(404).json({ error: 'Log não encontrado' });
    }

    // Verificar se o usuário tem permissão para ver este log
    if (req.user.tipo !== 'ADMIN' && req.user.tipo !== 'GESTOR' && log.userId !== req.user.id) {
      return res.status(403).json({ error: 'Você não tem permissão para ver este log' });
    }

    res.json(log);
  } catch (error) {
    console.error('Erro ao buscar log:', error);
    res.status(500).json({ error: 'Erro ao buscar log' });
  }
});

module.exports = router;

