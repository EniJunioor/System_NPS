const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../server');
const prisma = new PrismaClient();

describe('Rotas de Tickets', () => {
  let adminToken;
  let atendente;
  let adminUser;
  let ticketId;

  beforeAll(async () => {
    // Limpar o banco de dados antes dos testes
    await prisma.notification.deleteMany();
    await prisma.avaliacao.deleteMany();
    await prisma.token.deleteMany();
    await prisma.task.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.userSettings.deleteMany();
    await prisma.user.deleteMany();

    // Criar usuários para os testes
    adminUser = await prisma.user.create({
      data: {
        nome: 'Admin Tickets',
        email: 'admin.tickets@test.com',
        senha: await require('bcryptjs').hash('password', 10),
        tipo: 'GESTOR',
      },
    });

    atendente = await prisma.user.create({
      data: {
        nome: 'Atendente Tickets',
        email: 'atendente.tickets@test.com',
        senha: await require('bcryptjs').hash('password', 10),
        tipo: 'ATENDENTE',
      },
    });

    // Fazer login como admin para obter o token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: adminUser.email,
        senha: 'password',
      });
    adminToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /tickets - deve criar um novo ticket', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        titulo: 'Problema no sistema de faturamento',
        descricao: 'O sistema de faturamento não está calculando os impostos corretamente.',
        categoria: 'INCIDENTE',
        urgencia: 'ALTA',
        data: new Date().toISOString(),
        hora: new Date().toISOString(),
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.titulo).toBe('Problema no sistema de faturamento');
    ticketId = response.body.id;
  });

  it('GET /tickets - deve listar os tickets com filtros', async () => {
    const response = await request(app)
      .get('/tickets?search=faturamento&status=ABERTO&urgencia=ALTA')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.tickets).toBeInstanceOf(Array);
    expect(response.body.tickets.length).toBeGreaterThan(0);
    expect(response.body.tickets[0].id).toBe(ticketId);
  });

  it('GET /tickets/:id - deve retornar um ticket específico', async () => {
    const response = await request(app)
      .get(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${adminToken}`);
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', ticketId);
  });

  it('PUT /tickets/:id - deve atualizar um ticket e atribuí-lo a um atendente', async () => {
    const response = await request(app)
      .put(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'EM_ANDAMENTO',
        atendidoPorId: atendente.id,
      });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('EM_ANDAMENTO');
    expect(response.body.atendidoPorId).toBe(atendente.id);

    // Verificar se a notificação foi criada para o atendente
    const notification = await prisma.notification.findFirst({
        where: {
            userId: atendente.id,
            type: 'TICKET_ATRIBUIDO'
        }
    });
    expect(notification).not.toBeNull();
    expect(notification.message).toContain(`Você foi atribuído ao Ticket #${ticketId}`);
  });

  it('DELETE /tickets/:id - deve excluir o ticket', async () => {
    const response = await request(app)
      .delete(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(204);

    // Verificar se o ticket foi realmente excluído
    const getResponse = await request(app)
      .get(`/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getResponse.status).toBe(404);
  });
}); 