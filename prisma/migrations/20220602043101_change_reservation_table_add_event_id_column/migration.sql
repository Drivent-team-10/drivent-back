/*
  Warnings:

  - A unique constraint covering the columns `[event_id]` on the table `reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservation" ADD COLUMN     "event_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reservation_event_id_key" ON "reservation"("event_id");

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
