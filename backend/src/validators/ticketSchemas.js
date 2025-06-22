const Joi = require('joi');

const ticketSchema = Joi.object({
  titulo: Joi.string().min(5).required(),
  descricao: Joi.string().min(10).required(),
  categoria: Joi.string().valid('DUVIDA', 'INCIDENTE', 'SOLICITACAO', 'MELHORIA').required(),
  tags: Joi.array().items(Joi.string()),
  urgencia: Joi.string().valid('BAIXA', 'MEDIA', 'ALTA', 'CRITICA').required(),
  anexos: Joi.array().items(Joi.string().uri()),
  data: Joi.date().iso().required(),
  hora: Joi.date().iso().required(),
  status: Joi.string().valid('ABERTO', 'EM_ANDAMENTO', 'FINALIZADO', 'AGUARDANDO_ATENDIMENTO', 'AGUARDANDO_CLIENTE', 'CANCELADO'),
  atendidoPorId: Joi.string().uuid().allow(null),
});

// Para o PUT, a maioria dos campos é opcional
const updateTicketSchema = Joi.object({
  titulo: Joi.string().min(5),
  descricao: Joi.string().min(10),
  categoria: Joi.string().valid('DUVIDA', 'INCIDENTE', 'SOLICITACAO', 'MELHORIA'),
  tags: Joi.array().items(Joi.string()),
  urgencia: Joi.string().valid('BAIXA', 'MEDIA', 'ALTA', 'CRITICA'),
  anexos: Joi.array().items(Joi.string().uri()),
  data: Joi.date().iso(),
  hora: Joi.date().iso(),
  status: Joi.string().valid('ABERTO', 'EM_ANDAMENTO', 'FINALIZADO', 'AGUARDANDO_ATENDIMENTO', 'AGUARDANDO_CLIENTE', 'CANCELADO'),
  atendidoPorId: Joi.string().uuid().allow(null),
}).min(1); // Exige que pelo menos um campo seja fornecido para atualização

module.exports = {
  ticketSchema,
  updateTicketSchema,
}; 