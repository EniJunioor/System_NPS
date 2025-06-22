const bcrypt = require('bcrypt');

async function generatePasswordHash() {
  const password = '123456';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Senha original:', password);
  console.log('Hash gerado:', hash);
  
  // Gerar SQL para inserir usuários
  console.log('\n--- SQL para inserir usuários ---');
  console.log(`INSERT INTO "usuarios" (id, nome, email, senha, tipo, "createdAt", "updatedAt") VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Admin Teste', 'admin@teste.com', '${hash}', 'ADMIN', NOW(), NOW());`);
  console.log(`INSERT INTO "usuarios" (id, nome, email, senha, tipo, "createdAt", "updatedAt") VALUES ('550e8400-e29b-41d4-a716-446655440001', 'Atendente Teste', 'atendente@teste.com', '${hash}', 'ATENDENTE', NOW(), NOW());`);
}

generatePasswordHash().catch(console.error); 