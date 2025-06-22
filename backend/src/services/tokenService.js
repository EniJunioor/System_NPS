const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

class TokenService {
  // Gera um token único para avaliação
  static async gerarToken(telefone, atendente, dataAtendimento) {
    const token = crypto.randomBytes(16).toString('hex');
    const expiraEm = new Date();
    expiraEm.setHours(expiraEm.getHours() + 24); // Token válido por 24 horas

    const tokenAvaliacao = await prisma.tokenAvaliacao.create({
      data: {
        token,
        telefone,
        atendente,
        dataAtendimento: new Date(dataAtendimento),
        expiraEm
      }
    });

    return tokenAvaliacao;
  }

  // Valida um token
  static async validarToken(token) {
    const tokenAvaliacao = await prisma.tokenAvaliacao.findUnique({
      where: { token }
    });

    if (!tokenAvaliacao) {
      throw new Error('Token inválido');
    }

    if (tokenAvaliacao.usado) {
      throw new Error('Token já utilizado');
    }

    if (new Date() > tokenAvaliacao.expiraEm) {
      throw new Error('Token expirado');
    }

    return tokenAvaliacao;
  }

  // Gera link de avaliação
  static gerarLinkAvaliacao(token) {
    // Usar a URL do frontend (porta 5173 para Vite)
    return `http://localhost:5173/evaluate/${token}`;
  }
}

module.exports = TokenService; 