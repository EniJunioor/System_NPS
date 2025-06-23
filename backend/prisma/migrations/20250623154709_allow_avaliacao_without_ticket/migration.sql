-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_ticketId_fkey";

-- AlterTable
ALTER TABLE "avaliacoes" ALTER COLUMN "ticketId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
