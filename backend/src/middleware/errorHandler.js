const { Prisma } = require('@prisma/client');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Trata erros específicos do Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Recurso não encontrado (ex: update ou delete em um id que não existe)
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Recurso não encontrado' });
    }
    // Conflito de campo único (ex: criar usuário com email que já existe)
    if (err.code === 'P2002') {
        const fields = err.meta?.target || ['fields'];
        return res.status(409).json({ error: `O campo '${fields.join(', ')}' já existe.` });
    }
  }

  // Erros de validação já são tratados no middleware 'validate.js',
  // mas podemos ter uma camada extra aqui por segurança.
  if (err.isJoi) {
      return res.status(422).json({
          error: 'Erro de validação',
          messages: err.details.map(d => d.message).join(', ')
      });
  }

  // Para outros erros, retorna uma resposta genérica para não expor detalhes
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    error: message,
    // Expor o stack trace apenas em ambiente de desenvolvimento
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler; 