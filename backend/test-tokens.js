const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const API_BASE_URL = 'http://localhost:3001';

async function testTokens() {
  console.log('🧪 Testando sistema de tokens...\n');

  try {
    // 1. Fazer login para obter token de autenticação
    console.log('1. Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@teste.com',
      senha: '123456'
    });

    const authToken = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // 2. Gerar um token de avaliação
    console.log('\n2. Gerando token de avaliação...');
    const tokenResponse = await axios.post(`${API_BASE_URL}/tokens`, {
      telefone: '(11) 99999-9999',
      atendente: 'João Silva',
      dataAtendimento: new Date().toISOString()
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const generatedToken = tokenResponse.data.valor;
    const generatedLink = tokenResponse.data.link;
    console.log('✅ Token gerado:', generatedToken);
    console.log('✅ Link gerado:', generatedLink);

    // 3. Validar o token gerado
    console.log('\n3. Validando token...');
    const validationResponse = await axios.get(`${API_BASE_URL}/tokens/${generatedToken}`);
    console.log('✅ Token válido:', validationResponse.data);

    // 4. Testar link de avaliação
    console.log('\n4. Testando link de avaliação...');
    const evaluateUrl = `http://localhost:5173/evaluate/${generatedToken}`;
    console.log('🔗 Link para teste:', evaluateUrl);

    // 5. Verificar no banco de dados
    console.log('\n5. Verificando no banco de dados...');
    const tokenInDb = await prisma.tokenAvaliacao.findUnique({
      where: { token: generatedToken }
    });

    if (tokenInDb) {
      console.log('✅ Token encontrado no banco:', {
        id: tokenInDb.id,
        token: tokenInDb.token,
        telefone: tokenInDb.telefone,
        atendente: tokenInDb.atendente,
        usado: tokenInDb.usado,
        expiraEm: tokenInDb.expiraEm
      });
    } else {
      console.log('❌ Token não encontrado no banco');
    }

    // 6. Testar token inexistente
    console.log('\n6. Testando token inexistente...');
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

    console.log('\n🎉 Testes concluídos com sucesso!');
    console.log('\n📝 Para testar manualmente:');
    console.log(`1. Acesse: ${evaluateUrl}`);
    console.log('2. Preencha a avaliação');
    console.log('3. Envie o formulário');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    if (error.response) {
      console.error('Resposta da API:', error.response.data);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar testes
testTokens().catch(console.error); 