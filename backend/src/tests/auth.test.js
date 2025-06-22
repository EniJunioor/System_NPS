const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../server');
const prisma = new PrismaClient();

describe('Rotas de Autenticação', () => {
  beforeAll(async () => {
    // Limpar o banco de dados antes dos testes
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          nome: 'Teste',
          email: 'teste@teste.com',
          senha: '123456',
          tipo: 'ATENDENTE'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'teste@teste.com');
    });

    it('não deve registrar usuário com email duplicado', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          nome: 'Teste 2',
          email: 'teste@teste.com',
          senha: '123456',
          tipo: 'ATENDENTE'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email já cadastrado');
    });
  });

  describe('POST /auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'teste@teste.com',
          senha: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'teste@teste.com');
    });

    it('não deve fazer login com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'teste@teste.com',
          senha: 'senha_errada'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Email ou senha inválidos');
    });
  });

  // Novos testes para as rotas de perfil
  describe('Rotas de Perfil (requer autenticação)', () => {
    let token;

    beforeAll(async () => {
      // Registrar um novo usuário e fazer login para obter um token
      await request(app)
        .post('/auth/register')
        .send({
          nome: 'Usuario Para Perfil',
          email: 'perfil@teste.com',
          senha: 'senha_perfil',
          tipo: 'CLIENTE'
        });
      
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'perfil@teste.com',
          senha: 'senha_perfil'
        });
      token = loginResponse.body.token;
    });

    it('GET /auth/me - deve retornar o perfil do usuário', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'perfil@teste.com');
      expect(response.body).not.toHaveProperty('senha');
    });

    it('PUT /auth/profile - deve atualizar o perfil do usuário', async () => {
      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Usuario Perfil Atualizado',
          sobrenome: 'Sobrenome Teste',
          telefone: '123456789'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('nome', 'Usuario Perfil Atualizado');
      expect(response.body).toHaveProperty('sobrenome', 'Sobrenome Teste');
    });

    it('PATCH /auth/change-password - deve alterar a senha', async () => {
      const response = await request(app)
        .patch('/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'senha_perfil',
          newPassword: 'nova_senha_perfil'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Senha alterada com sucesso');

      // Tentar fazer login com a nova senha
      const loginAttempt = await request(app)
        .post('/auth/login')
        .send({
          email: 'perfil@teste.com',
          senha: 'nova_senha_perfil'
        });
      expect(loginAttempt.status).toBe(200);
    });

    it('PUT /auth/settings - deve atualizar as configurações do usuário', async () => {
        const response = await request(app)
          .put('/auth/settings')
          .set('Authorization', `Bearer ${token}`)
          .send({
            theme: 'dark',
            language: 'en-US'
          });
  
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('theme', 'dark');
        expect(response.body).toHaveProperty('language', 'en-US');
      });

    it('DELETE /auth/me - deve excluir a conta do usuário', async () => {
        const response = await request(app)
          .delete('/auth/me')
          .set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Conta excluída com sucesso');
  
        // Tentar fazer login com o usuário excluído
        const loginAttempt = await request(app)
          .post('/auth/login')
          .send({
            email: 'perfil@teste.com',
            senha: 'nova_senha_perfil'
          });
        expect(loginAttempt.status).toBe(401);
      });
  });
}); 