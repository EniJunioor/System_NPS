import { 
  authService, 
  taskService, 
  ticketService, 
  avaliacaoService, 
  tokenService, 
  dashboardService,
  notificationService 
} from '../services';

export const testIntegration = async () => {
  console.log('🧪 Iniciando testes de integração...');
  
  const results = {
    auth: false,
    tasks: false,
    tickets: false,
    avaliacoes: false,
    tokens: false,
    dashboard: false,
    notifications: false,
  };

  try {
    // Teste de autenticação
    console.log('📝 Testando autenticação...');
    try {
      const loginResult = await authService.login({
        email: 'test@example.com',
        senha: 'password123'
      });
      console.log('✅ Login funcionando');
      results.auth = true;
    } catch (error) {
      console.log('❌ Erro no login:', error);
    }

    // Teste de tarefas
    console.log('📋 Testando tarefas...');
    try {
      const tasks = await taskService.getTasks(1, 5);
      console.log('✅ Listagem de tarefas funcionando');
      results.tasks = true;
    } catch (error) {
      console.log('❌ Erro na listagem de tarefas:', error);
    }

    // Teste de tickets
    console.log('🎫 Testando tickets...');
    try {
      const tickets = await ticketService.getTickets(1, 5);
      console.log('✅ Listagem de tickets funcionando');
      results.tickets = true;
    } catch (error) {
      console.log('❌ Erro na listagem de tickets:', error);
    }

    // Teste de avaliações
    console.log('⭐ Testando avaliações...');
    try {
      const avaliacoes = await avaliacaoService.getAvaliacoes(1, 5);
      console.log('✅ Listagem de avaliações funcionando');
      results.avaliacoes = true;
    } catch (error) {
      console.log('❌ Erro na listagem de avaliações:', error);
    }

    // Teste de tokens
    console.log('🔑 Testando tokens...');
    try {
      const tokens = await tokenService.getTokens(1, 5);
      console.log('✅ Listagem de tokens funcionando');
      results.tokens = true;
    } catch (error) {
      console.log('❌ Erro na listagem de tokens:', error);
    }

    // Teste de dashboard
    console.log('📊 Testando dashboard...');
    try {
      const stats = await dashboardService.getDashboardStats();
      console.log('✅ Estatísticas do dashboard funcionando');
      results.dashboard = true;
    } catch (error) {
      console.log('❌ Erro nas estatísticas do dashboard:', error);
    }

    // Teste de notificações
    console.log('🔔 Testando notificações...');
    try {
      const notifications = await notificationService.getNotifications(1, 5);
      console.log('✅ Listagem de notificações funcionando');
      results.notifications = true;
    } catch (error) {
      console.log('❌ Erro na listagem de notificações:', error);
    }

  } catch (error) {
    console.error('❌ Erro geral nos testes:', error);
  }

  // Resumo dos resultados
  console.log('\n📊 Resumo dos testes de integração:');
  console.log('=====================================');
  Object.entries(results).forEach(([service, success]) => {
    console.log(`${success ? '✅' : '❌'} ${service.toUpperCase()}`);
  });

  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 Resultado: ${successCount}/${totalCount} serviços funcionando`);
  
  if (successCount === totalCount) {
    console.log('🎉 Integração completa funcionando perfeitamente!');
  } else {
    console.log('⚠️  Alguns serviços precisam de atenção.');
  }

  return results;
};

// Função para testar conectividade básica
export const testConnectivity = async () => {
  console.log('🌐 Testando conectividade com o backend...');
  
  try {
    const response = await fetch('http://localhost:3001/api-docs');
    if (response.ok) {
      console.log('✅ Backend está acessível');
      return true;
    } else {
      console.log('❌ Backend não está respondendo corretamente');
      return false;
    }
  } catch (error) {
    console.log('❌ Erro de conectividade:', error);
    return false;
  }
};

// Função para verificar configuração
export const checkConfiguration = () => {
  console.log('⚙️  Verificando configuração...');
  
  const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    timeout: 10000,
  };

  console.log('📋 Configuração atual:');
  console.log(`   API URL: ${config.apiUrl}`);
  console.log(`   Timeout: ${config.timeout}ms`);

  return config;
}; 