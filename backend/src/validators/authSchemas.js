const Joi = require('joi');

const registerSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  tipo: Joi.string().valid('ADMIN', 'GESTOR', 'ATENDENTE', 'CLIENTE').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  nome: Joi.string().min(3),
  sobrenome: Joi.string().allow(null, ''),
  telefone: Joi.string().allow(null, ''),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const updateSettingsSchema = Joi.object({
    theme: Joi.string(),
    timezone: Joi.string(),
    language: Joi.string(),
    notificationsOn: Joi.boolean(),
});


module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateSettingsSchema,
}; 