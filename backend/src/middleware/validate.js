const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    // Coleta todos os erros de validação em vez de apenas o primeiro
    const errors = error.details.map((detail) => detail.message).join(', ');
    // Retorna um status 422 Unprocessable Entity, que é mais semântico para falhas de validação
    return res.status(422).json({
      error: 'Erro de validação',
      messages: errors,
    });
  }

  next();
};

module.exports = validate; 