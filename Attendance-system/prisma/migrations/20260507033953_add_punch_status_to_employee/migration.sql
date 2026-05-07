-- CreateEnum
CREATE TYPE "PunchStatus" AS ENUM ('PUNCHED_IN', 'PUNCHED_OUT');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "punchStatus" "PunchStatus" NOT NULL DEFAULT 'PUNCHED_OUT';
