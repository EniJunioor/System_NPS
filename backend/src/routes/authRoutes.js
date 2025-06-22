const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateSettingsSchema,
} = require('../validators/authSchemas');
const prisma = new PrismaClient();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 *       422:
 *         description: Erro de validação
 */
router.post('/login', validate(loginSchema), async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { senha: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - tipo
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Email já cadastrado
 *       422:
 *         description: Erro de validação
 */
router.post('/register', validate(registerSchema), async (req, res, next) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        tipo,
      },
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { senha: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/users', authenticateToken, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        tipo: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });

    // Transformar para o formato esperado pelo frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.nome,
      role: user.tipo,
    }));

    res.json(formattedUsers);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna o perfil completo do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        settings: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { senha: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Atualiza o perfil do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sobrenome:
 *                 type: string
 *               telefone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao atualizar perfil
 *       422:
 *         description: Erro de validação
 */
router.put('/profile', authenticateToken, validate(updateProfileSchema), async (req, res, next) => {
  const { nome, sobrenome, telefone } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        nome,
        sobrenome,
        telefone,
      },
    });
    const { senha: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Altera a senha do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       401:
 *         description: Senha atual incorreta
 *       500:
 *         description: Erro ao alterar senha
 *       422:
 *         description: Erro de validação
 */
router.patch('/change-password', authenticateToken, validate(changePasswordSchema), async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.senha);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { senha: hashedNewPassword },
    });

    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/me:
 *   delete:
 *     summary: Exclui a conta do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conta excluída com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao excluir conta
 */
router.delete('/me', authenticateToken, async (req, res, next) => {
  try {
    // Adicionar lógica de exclusão em cascata ou anonimização se necessário
    await prisma.user.delete({
      where: { id: req.user.userId },
    });
    res.status(200).json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /auth/settings:
 *   put:
 *     summary: Atualiza as configurações do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               timezone:
 *                 type: string
 *               language:
 *                 type: string
 *               notificationsOn:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Configurações atualizadas com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao atualizar configurações
 *       422:
 *         description: Erro de validação
 */
router.put('/settings', authenticateToken, validate(updateSettingsSchema), async (req, res, next) => {
  const { theme, timezone, language, notificationsOn } = req.body;
  try {
    const userSettings = await prisma.userSettings.upsert({
      where: { userId: req.user.userId },
      update: {
        theme,
        timezone,
        language,
        notificationsOn,
      },
      create: {
        userId: req.user.userId,
        theme,
        timezone,
        language,
        notificationsOn,
      },
    });
    res.json(userSettings);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 