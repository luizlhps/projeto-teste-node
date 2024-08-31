/*
  Warnings:

  - Made the column `image_url` on table `Measure` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Measure" ALTER COLUMN "image_url" SET NOT NULL;
