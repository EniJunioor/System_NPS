const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testTokenIntegration() {
  console.log('🧪 Testando integração da API de tokens...\n');

  try {
    // 1. Testar geração de token (sem autenticação - deve falhar)
    console.log('1. Testando geração de token sem autenticação...');
    try {
      await axios.post(`${API_BASE_URL}/tokens`, {
        telefone: '(11) 99999-9999',
        atendente: 'João Silva',
        dataAtendimento: new Date().toISOString()
      });
      console.log('❌ ERRO: Token foi gerado sem autenticação');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ CORRETO: Token não foi gerado sem autenticação');
      } else {
        console.log('⚠️  AVISO: Erro inesperado:', error.response?.status);
      }
    }

    // 2. Testar validação de token inexistente
    console.log('\n2. Testando validação de token inexistente...');
    try {
      await axios.get(`${API_BASE_URL}/tokens/token-inexistente`);
      console.log('❌ ERRO: Token inexistente foi validado');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ CORRETO: Token inexistente foi rejeitado');
      } else {
        console.log('⚠️  AVISO: Erro inesperado:', error.response?.status);
      }
    }

    // 3. Testar estrutura da resposta de erro
    console.log('\n3. Testando estrutura da resposta de erro...');
    try {
      await axios.get(`${API_BASE_URL}/tokens/token-inexistente`);
    } catch (error) {
      if (error.response?.data?.error) {
        console.log('✅ CORRETO: Resposta de erro tem estrutura adequada');
        console.log(`   Mensagem: ${error.response.data.error}`);
      } else {
        console.log('❌ ERRO: Resposta de erro não tem estrutura adequada');
      }
    }

    console.log('\n🎉 Testes de integração concluídos!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Configure o banco de dados PostgreSQL');
    console.log('2. Execute as migrações: npx prisma migrate dev');
    console.log('3. Inicie o servidor: npm start');
    console.log('4. Teste a geração de tokens com autenticação');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

// Executar testes se o servidor estiver rodando
testTokenIntegration().catch(console.error); 