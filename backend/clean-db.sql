-- Desabilita as restrições de chave estrangeira temporariamente
SET session_replication_role = 'replica';

-- Remove as tabelas na ordem correta
DROP TABLE IF EXISTS "tokens_avaliacao" CASCADE;
DROP TABLE IF EXISTS "avaliacoes" CASCADE;
DROP TABLE IF EXISTS "tokens" CASCADE;
DROP TABLE IF EXISTS "tickets" CASCADE;
DROP TABLE IF EXISTS "usuarios" CASCADE;

-- Remove os tipos enum
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "TicketStatus" CASCADE;

-- Reabilita as restrições de chave estrangeira
SET session_replication_role = 'origin'; 