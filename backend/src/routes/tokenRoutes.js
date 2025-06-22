const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const TokenService = require('../services/tokenService');

/**
 * @swagger
 * components:
 *   schemas:
 *     TokenAvaliacao:
 *       type: object
 *       required:
 *         - telefone
 *         - atendente
 *         - dataAtendimento
 *       properties:
 *         token:
 *           type: string
 *           description: Token único de avaliação
 *         telefone:
 *           type: string
 *           description: Telefone do cliente
 *         atendente:
 *           type: string
 *           description: Nome do atendente
 *         dataAtendimento:
 *           type: string
 *           format: date-time
 *           description: Data e hora do atendimento
 *         expiraEm:
 *           type: string
 *           format: date-time
 *           description: Data de expiração do token
 *         usado:
 *           type: boolean
 *           description: Se o token já foi usado
 *         createdAt:
 *           type: string
 *           format: date-time
 *     TokenResponse:
 *       type: object
 *       properties:
 *         valor:
 *           type: string
 *           description: Token gerado
 *         expiraEm:
 *           type: string
 *           format: date-time
 *           description: Data de expiração
 *         link:
 *           type: string
 *           description: Link de avaliação
 */

/**
 * @swagger
 * /tokens:
 *   post:
 *     summary: Gerar token para avaliação
 *     tags: [Tokens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - telefone
 *               - atendente
 *               - dataAtendimento
 *             properties:
 *               telefone:
 *                 type: string
 *                 description: Telefone do cliente
 *               atendente:
 *                 type: string
 *                 description: Nome do atendente
 *               dataAtendimento:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do atendimento
 *     responses:
 *       201:
 *         description: Token gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Dados obrigatórios não fornecidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', authenticateToken, async (req, res) => {
  const { telefone, atendente, dataAtendimento } = req.body;

  try {
    // Validar dados obrigatórios
    if (!telefone || !atendente || !dataAtendimento) {
      return res.status(400).json({ 
        error: 'Telefone, atendente e data de atendimento são obrigatórios' 
      });
    }

    // Gerar token usando o serviço
    const tokenAvaliacao = await TokenService.gerarToken(telefone, atendente, dataAtendimento);
    
    // Gerar link de avaliação
    const link = TokenService.gerarLinkAvaliacao(tokenAvaliacao.token);

    res.status(201).json({
      valor: tokenAvaliacao.token,
      expiraEm: tokenAvaliacao.expiraEm,
      link: link
    });
  } catch (error) {
    console.error('Erro ao gerar token:', error);
    res.status(500).json({ error: 'Erro ao gerar token de avaliação' });
  }
});

/**
 * @swagger
 * /tokens/{valor}:
 *   get:
 *     summary: Validar token de avaliação
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: valor
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de avaliação
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenAvaliacao'
 *       400:
 *         description: Token inválido ou expirado
 */
router.get('/:valor', async (req, res) => {
  const { valor } = req.params;

  try {
    const tokenAvaliacao = await TokenService.validarToken(valor);
    
    res.json({
      token: tokenAvaliacao.token,
      telefone: tokenAvaliacao.telefone,
      atendente: tokenAvaliacao.atendente,
      dataAtendimento: tokenAvaliacao.dataAtendimento,
      expiraEm: tokenAvaliacao.expiraEm,
      usado: tokenAvaliacao.usado
    });
  } catch (error) {
    console.error('Erro ao validar token:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /tokens/{valor}/usar:
 *   put:
 *     summary: Marcar token como usado
 *     tags: [Tokens]
 *     parameters:
 *       - in: path
 *         name: valor
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de avaliação
 *     responses:
 *       200:
 *         description: Token marcado como usado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   $ref: '#/components/schemas/TokenAvaliacao'
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:valor/usar', async (req, res) => {
  const { valor } = req.params;

  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const tokenAvaliacao = await prisma.tokenAvaliacao.update({
      where: { token: valor },
      data: { usado: true }
    });

    res.json({ message: 'Token marcado como usado', token: tokenAvaliacao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao marcar token como usado' });
  }
});

module.exports = router; 