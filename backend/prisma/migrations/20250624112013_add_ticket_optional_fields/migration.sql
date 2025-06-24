-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "autoAssign" BOOLEAN,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "expectedResult" TEXT,
ADD COLUMN     "markUrgent" BOOLEAN,
ADD COLUMN     "notifyClient" BOOLEAN,
ADD COLUMN     "reproSteps" TEXT;
