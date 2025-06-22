const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Verificar se o diretório de uploads existe, senão criar
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para armazenamento local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Garante um nome de arquivo único adicionando um timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Endpoints para upload de arquivos
 */

/**
 * @swagger
 * /upload/attachments:
 *   post:
 *     summary: Faz upload de um ou mais anexos
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         description: URL do arquivo para ser salva no ticket/tarefa
 *       400:
 *         description: Nenhum arquivo enviado
 *       500:
 *         description: Erro no upload
 */
router.post('/attachments', authenticateToken, upload.array('attachments', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ error: 'Nenhum arquivo enviado.' });
  }

  try {
    const files = req.files.map(file => {
      // A URL retornada deve ser acessível pelo frontend.
      // Assumindo que o backend servirá os arquivos estaticamente da pasta 'uploads'.
      const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      return { url };
    });

    res.status(200).json({ files });
  } catch (error) {
    console.error("Erro no upload de anexos:", error);
    res.status(500).json({ error: 'Erro no upload' });
  }
});

module.exports = router; 