/*
  Warnings:

  - Added the required column `titulo` to the `tarefas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urgencia` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketUrgency" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('DUVIDA', 'INCIDENTE', 'SOLICITACAO', 'MELHORIA');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NOVO_TICKET', 'TICKET_ATRIBUIDO', 'TICKET_ATUALIZADO', 'NOVA_TAREFA', 'TAREFA_ATRIBUIDA', 'TAREFA_CONCLUIDA', 'AVALIACAO_RECEBIDA', 'MENCAO');

-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'EM_ESPERA';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskTag" ADD VALUE 'DOCUMENTACAO';
ALTER TYPE "TaskTag" ADD VALUE 'REUNIAO';

-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'CANCELADO';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'CLIENTE';

-- AlterTable
ALTER TABLE "avaliacoes" ADD COLUMN     "comentario" TEXT;

-- AlterTable
ALTER TABLE "tarefas" ADD COLUMN     "anexos" TEXT[],
ADD COLUMN     "dataInicio" TIMESTAMP(3),
ADD COLUMN     "dataVencimento" TIMESTAMP(3),
ADD COLUMN     "prioridade" "TaskPriority" NOT NULL DEFAULT 'MEDIA',
ADD COLUMN     "projeto" TEXT,
ADD COLUMN     "ticketId" TEXT,
ADD COLUMN     "titulo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "anexos" TEXT[],
ADD COLUMN     "categoria" "TicketCategory" NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "titulo" TEXT NOT NULL,
ADD COLUMN     "urgencia" "TicketUrgency" NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "sobrenome" TEXT,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "configuracoes_usuario" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "notificationsOn" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "configuracoes_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configuracoes_usuario_userId_key" ON "configuracoes_usuario"("userId");

-- AddForeignKey
ALTER TABLE "configuracoes_usuario" ADD CONSTRAINT "configuracoes_usuario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
