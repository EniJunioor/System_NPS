const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const logRoutes = require('./routes/logRoutes');
const { authenticateToken } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { loggingMiddleware } = require('./middleware/logging');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rotas públicas
app.use('/auth', authRoutes);
app.use('/tokens', tokenRoutes);
app.use('/avaliacoes', avaliacaoRoutes);

// Rotas protegidas com logging
app.use('/tickets', authenticateToken, loggingMiddleware, ticketRoutes);
app.use('/tasks', authenticateToken, loggingMiddleware, taskRoutes);
app.use('/dashboard', authenticateToken, loggingMiddleware, dashboardRoutes);
app.use('/notifications', authenticateToken, loggingMiddleware, notificationRoutes);
app.use('/upload', authenticateToken, loggingMiddleware, uploadRoutes);
app.use('/logs', authenticateToken, logRoutes);

// Middleware de Erro Global
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação Swagger disponível em: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app; 