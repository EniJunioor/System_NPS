-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TaskTag" AS ENUM ('TREINAMENTO', 'IMPLANTACAO', 'SUPORTE_TECNICO', 'DESENVOLVIMENTO', 'MANUTENCAO');

-- CreateTable
CREATE TABLE "tarefas" (
    "id" TEXT NOT NULL,
    "duracao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tag" "TaskTag" NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDENTE',
    "sistema" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "criadoPorId" TEXT NOT NULL,
    "responsavelId" TEXT,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
