require('dotenv').config();

// Configuração do timeout para os testes
jest.setTimeout(10000);

// Limpar o banco de dados após cada teste
// afterEach(async () => {
//   const { PrismaClient } = require('@prisma/client');
//   const prisma = new PrismaClient();
  
//   try {
//     await prisma.user.deleteMany();
//     await prisma.$disconnect();
//   } catch (error) {
//     console.error('Erro ao limpar banco de dados:', error);
//   }
// }); 