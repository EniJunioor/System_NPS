const Joi = require('joi');

const avaliacaoSchema = Joi.object({
  sistema: Joi.number().integer().min(0).max(10).required(),
  atendimento: Joi.number().integer().min(0).max(10).required(),
  token: Joi.string().required(),
  comentario: Joi.string().allow(null, '').max(500),
});

module.exports = {
  avaliacaoSchema,
}; 