/*
  Warnings:

  - You are about to drop the `ChallengeLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChallengeTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChallengeTestCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyChallenge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dailyEligible` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Challenge` table. All the data in the column will be lost.
  - Added the required column `dailyKey` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ChallengeLanguage_challengeId_value_key";

-- DropIndex
DROP INDEX "ChallengeLanguage_challengeId_idx";

-- DropIndex
DROP INDEX "ChallengeTag_challengeId_value_key";

-- DropIndex
DROP INDEX "ChallengeTag_challengeId_idx";

-- DropIndex
DROP INDEX "ChallengeTestCase_challengeId_order_idx";

-- DropIndex
DROP INDEX "ChallengeTestCase_challengeId_idx";

-- DropIndex
DROP INDEX "DailyChallenge_challengeId_idx";

-- DropIndex
DROP INDEX "DailyChallenge_date_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChallengeLanguage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChallengeTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChallengeTestCase";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DailyChallenge";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "sourcePath" TEXT NOT NULL,
    "dailyKey" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Challenge" ("createdAt", "id", "isPublished", "slug", "sourcePath", "updatedAt") SELECT "createdAt", "id", "isPublished", "slug", "sourcePath", "updatedAt" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE UNIQUE INDEX "Challenge_slug_key" ON "Challenge"("slug");
CREATE UNIQUE INDEX "Challenge_sourcePath_key" ON "Challenge"("sourcePath");
CREATE UNIQUE INDEX "Challenge_dailyKey_key" ON "Challenge"("dailyKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
