const Joi = require('joi');

const taskSchema = Joi.object({
  titulo: Joi.string().min(5).required(),
  duracao: Joi.string().required(),
  descricao: Joi.string().min(10).required(),
  tag: Joi.string().valid('TREINAMENTO', 'IMPLANTACAO', 'SUPORTE_TECNICO', 'DESENVOLVIMENTO', 'MANUTENCAO', 'DOCUMENTACAO', 'REUNIAO').required(),
  prioridade: Joi.string().valid('BAIXA', 'MEDIA', 'ALTA').required(),
  dataInicio: Joi.date().iso().allow(null),
  dataVencimento: Joi.date().iso().allow(null),
  projeto: Joi.string().allow(null, ''),
  sistema: Joi.string().allow(null, ''),
  anexos: Joi.array().items(Joi.string().uri()),
  videoUrl: Joi.string().uri().allow(null, ''),
  responsavelId: Joi.string().uuid().allow(null),
  ticketId: Joi.string().uuid().allow(null),
});

const updateTaskSchema = Joi.object({
  titulo: Joi.string().min(5),
  duracao: Joi.string(),
  descricao: Joi.string().min(10),
  tag: Joi.string().valid('TREINAMENTO', 'IMPLANTACAO', 'SUPORTE_TECNICO', 'DESENVOLVIMENTO', 'MANUTENCAO', 'DOCUMENTACAO', 'REUNIAO'),
  status: Joi.string().valid('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'EM_ESPERA'),
  prioridade: Joi.string().valid('BAIXA', 'MEDIA', 'ALTA'),
  dataInicio: Joi.date().iso().allow(null),
  dataVencimento: Joi.date().iso().allow(null),
  projeto: Joi.string().allow(null, ''),
  sistema: Joi.string().allow(null, ''),
  anexos: Joi.array().items(Joi.string().uri()),
  videoUrl: Joi.string().uri().allow(null, ''),
  responsavelId: Joi.string().uuid().allow(null),
  ticketId: Joi.string().uuid().allow(null),
}).min(1);

module.exports = {
  taskSchema,
  updateTaskSchema,
}; 