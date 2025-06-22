-- Script para inserir dados de teste
-- Execute após as migrações do Prisma

-- Inserir usuário de teste (senha: 123456)
INSERT INTO "usuarios" (id, nome, email, senha, tipo, "createdAt", "updatedAt") 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Admin Teste',
  'admin@teste.com',
  '$2b$10$zdl8iNu68UjdH.JCPiLKlOJWfbXz/CacOuOV3cEo4ey/RjvAoUMbm',
  'ADMIN',
  NOW(),
  NOW()
);

-- Inserir usuário atendente (senha: 123456)
INSERT INTO "usuarios" (id, nome, email, senha, tipo, "createdAt", "updatedAt") 
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Atendente Teste',
  'atendente@teste.com',
  '$2b$10$zdl8iNu68UjdH.JCPiLKlOJWfbXz/CacOuOV3cEo4ey/RjvAoUMbm',
  'ATENDENTE',
  NOW(),
  NOW()
);

-- Inserir alguns tickets de exemplo
INSERT INTO "tickets" (id, descricao, data, hora, status, "criadoPorId", "createdAt", "updatedAt")
VALUES 
  (
    'ticket-001',
    'Problema com login no sistema',
    '2024-01-15',
    '2024-01-15 10:30:00',
    'ABERTO',
    '550e8400-e29b-41d4-a716-446655440000',
    NOW(),
    NOW()
  ),
  (
    'ticket-002',
    'Dúvida sobre funcionalidade',
    '2024-01-16',
    '2024-01-16 14:15:00',
    'EM_ANDAMENTO',
    '550e8400-e29b-41d4-a716-446655440001',
    NOW(),
    NOW()
  );

-- Inserir alguns tokens de avaliação de exemplo
INSERT INTO "tokens_avaliacao" (id, token, telefone, atendente, "dataAtendimento", "expiraEm", usado, "createdAt")
VALUES 
  (
    'token-001',
    'abc123def456ghi789',
    '(11) 99999-9999',
    'João Silva',
    '2024-01-15 10:30:00',
    '2024-01-16 10:30:00',
    false,
    NOW()
  ),
  (
    'token-002',
    'xyz789abc123def456',
    '(11) 88888-8888',
    'Maria Santos',
    '2024-01-16 14:15:00',
    '2024-01-17 14:15:00',
    false,
    NOW()
  );

-- Inserir algumas avaliações de exemplo
INSERT INTO "avaliacoes" (id, sistema, atendimento, "ticketId", "createdAt")
VALUES 
  (
    'avaliacao-001',
    8,
    9,
    'ticket-001',
    NOW()
  ),
  (
    'avaliacao-002',
    7,
    8,
    'ticket-002',
    NOW()
  );

-- Atualizar tickets com avaliações
UPDATE "tickets" SET "atendidoPorId" = '550e8400-e29b-41d4-a716-446655440001' WHERE id = 'ticket-001';
UPDATE "tickets" SET "atendidoPorId" = '550e8400-e29b-41d4-a716-446655440000' WHERE id = 'ticket-002';

COMMIT; 