const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuração do transporter do Nodemailer usando variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465, // true para porta 465, false para outras
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envia um email.
 * @param {string} to - O destinatário do email.
 * @param {string} subject - O assunto do email.
 * @param {string} text - O corpo do email em texto plano.
 * @param {string} html - O corpo do email em HTML.
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // Remetente
      to,                            // Destinatário
      subject,                       // Assunto
      text,                          // Corpo em texto plano
      html,                          // Corpo em HTML
    });
    console.log(`Email enviado com sucesso para ${to}`);
  } catch (error) {
    console.error(`Erro ao enviar email para ${to}:`, error);
    // Em um app de produção, você poderia lançar o erro ou lidar com ele de outra forma
  }
};

module.exports = { sendEmail }; 