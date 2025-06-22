const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando banco de dados...\n');

try {
  // 1. Verificar se o arquivo .env existe
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ Arquivo .env não encontrado!');
    console.log('📝 Crie um arquivo .env na raiz do backend com:');
    console.log(`
DATABASE_URL="postgresql://username:password@localhost:5432/ava_nps"
DIRECT_URL="postgresql://username:password@localhost:5432/ava_nps"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3001
NODE_ENV=development
    `);
    process.exit(1);
  }

  console.log('✅ Arquivo .env encontrado');

  // 2. Instalar dependências
  console.log('\n📦 Instalando dependências...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas');

  // 3. Gerar cliente Prisma
  console.log('\n🔧 Gerando cliente Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente Prisma gerado');

  // 4. Executar migrações
  console.log('\n🗄️ Executando migrações...');
  execSync('npx prisma migrate dev', { stdio: 'inherit' });
  console.log('✅ Migrações executadas');

  // 5. Inserir dados de teste
  console.log('\n📊 Inserindo dados de teste...');
  console.log('⚠️  Execute manualmente: psql -d ava_nps -f seed-data.sql');
  console.log('   Ou use o Prisma Studio: npx prisma studio');

  console.log('\n🎉 Configuração concluída!');
  console.log('\n📝 Próximos passos:');
  console.log('1. Configure o banco PostgreSQL');
  console.log('2. Execute: psql -d ava_nps -f seed-data.sql');
  console.log('3. Inicie o servidor: npm start');
  console.log('4. Acesse: http://localhost:3001/api-docs');

} catch (error) {
  console.error('❌ Erro durante a configuração:', error.message);
  process.exit(1);
} 