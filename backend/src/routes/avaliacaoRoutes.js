const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const validate = require('../middleware/validate');
const { avaliacaoSchema } = require('../validators/avaliacaoSchemas');

/**
 * @swagger
 * components:
 *   schemas:
 *     Avaliacao:
 *       type: object
 *       required:
 *         - sistema
 *         - atendimento
 *         - token
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da avaliação
 *         sistema:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *           description: Nota do sistema (0-10)
 *         atendimento:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *           description: Nota do atendimento (0-10)
 *         ticketId:
 *           type: string
 *           description: ID do ticket relacionado
 *         comentario:
 *           type: string
 *           description: Comentário opcional do cliente
 *         createdAt:
 *           type: string
 *           format: date-time
 *     AvaliacaoRequest:
 *       type: object
 *       required:
 *         - sistema
 *         - atendimento
 *         - token
 *       properties:
 *         sistema:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *           description: Nota do sistema (0-10)
 *         atendimento:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *           description: Nota do atendimento (0-10)
 *         token:
 *           type: string
 *           description: Token de avaliação
 *         comentario:
 *           type: string
 *           description: Comentário opcional do cliente
 *     AvaliacaoResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de sucesso
 *         avaliacao:
 *           $ref: '#/components/schemas/Avaliacao'
 *         ticket:
 *           type: object
 *           description: Ticket criado para a avaliação
 *     NPSStats:
 *       type: object
 *       properties:
 *         totalAvaliacoes:
 *           type: integer
 *           description: Total de avaliações
 *         promotores:
 *           type: integer
 *           description: Número de promotores (nota 9-10)
 *         detratores:
 *           type: integer
 *           description: Número de detratores (nota 0-6)
 *         nps:
 *           type: integer
 *           description: Score NPS calculado
 */

/**
 * @swagger
 * /avaliacoes:
 *   post:
 *     summary: Criar uma nova avaliação
 *     tags: [Avaliações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sistema
 *               - atendimento
 *               - token
 *               - comentario
 *             properties:
 *               sistema:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: Nota do sistema (0-10)
 *               atendimento:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 10
 *                 description: Nota do atendimento (0-10)
 *               token:
 *                 type: string
 *                 description: Token de avaliação único associado ao ticket
 *               comentario:
 *                 type: string
 *                 description: (Opcional) Comentário do cliente sobre o atendimento
 *               ticketId:
 *                 type: string
 *                 description: ID do ticket relacionado
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvaliacaoResponse'
 *       400:
 *         description: Token inválido, já utilizado ou expirado
 *       500:
 *         description: Erro interno do servidor
 *       422:
 *         description: Erro de validação
 */
router.post('/', validate(avaliacaoSchema), async (req, res, next) => {
  const { sistema, atendimento, token, comentario } = req.body;

  try {
    // Verificar se o token existe, é válido e não foi usado
    const tokenInfo = await prisma.tokenAvaliacao.findUnique({
      where: { token },
    });

    if (!tokenInfo) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    if (tokenInfo.usado) {
      return res.status(400).json({ error: 'Token já utilizado' });
    }

    if (new Date() > tokenInfo.expiraEm) {
      return res.status(400).json({ error: 'Token expirado' });
    }

    // Criar a avaliação vinculada ao ticket do token, se houver
    const avaliacao = await prisma.avaliacao.create({
      data: {
        sistema,
        atendimento,
        comentario,
        ...(tokenInfo.ticketId ? { ticketId: tokenInfo.ticketId } : {}),
      },
    });

    // Marcar token como usado
    await prisma.tokenAvaliacao.update({
      where: { id: tokenInfo.id },
      data: { usado: true },
    });

    // Opcional: Atualizar o status do ticket para finalizado, se houver ticketId
    if (tokenInfo.ticketId) {
      await prisma.ticket.update({
        where: { id: tokenInfo.ticketId },
        data: { status: 'FINALIZADO' }
      });
    }

    res.status(201).json({
      message: 'Avaliação registrada com sucesso',
      avaliacao,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /avaliacoes/stats:
 *   get:
 *     summary: Obter estatísticas do NPS
 *     tags: [Avaliações]
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NPSStats'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/stats', async (req, res, next) => {
  try {
    const avaliacoes = await prisma.avaliacao.findMany();

    const totalAvaliacoes = avaliacoes.length;
    const promotores = avaliacoes.filter(a => a.sistema >= 9 && a.atendimento >= 9).length;
    const detratores = avaliacoes.filter(a => a.sistema <= 6 || a.atendimento <= 6).length;

    const nps = totalAvaliacoes > 0
      ? ((promotores - detratores) / totalAvaliacoes) * 100
      : 0;

    res.json({
      totalAvaliacoes,
      promotores,
      detratores,
      nps: Math.round(nps),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 