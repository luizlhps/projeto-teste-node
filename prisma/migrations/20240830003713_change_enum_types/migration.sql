/*
  Warnings:

  - The values [Water,Gas] on the enum `Measure_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Measure_type_new" AS ENUM ('WATER', 'GAS');
ALTER TABLE "Measure" ALTER COLUMN "measure_type" TYPE "Measure_type_new" USING ("measure_type"::text::"Measure_type_new");
ALTER TYPE "Measure_type" RENAME TO "Measure_type_old";
ALTER TYPE "Measure_type_new" RENAME TO "Measure_type";
DROP TYPE "Measure_type_old";
COMMIT;
