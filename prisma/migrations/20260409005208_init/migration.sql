-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "sourcePath" TEXT NOT NULL,
    "estimatedTime" INTEGER,
    "dailyEligible" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChallengeTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "ChallengeTag_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChallengeLanguage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "ChallengeLanguage_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChallengeTestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ChallengeTestCase_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyChallenge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    CONSTRAINT "DailyChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_slug_key" ON "Challenge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_sourcePath_key" ON "Challenge"("sourcePath");

-- CreateIndex
CREATE INDEX "ChallengeTag_challengeId_idx" ON "ChallengeTag"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeTag_challengeId_value_key" ON "ChallengeTag"("challengeId", "value");

-- CreateIndex
CREATE INDEX "ChallengeLanguage_challengeId_idx" ON "ChallengeLanguage"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeLanguage_challengeId_value_key" ON "ChallengeLanguage"("challengeId", "value");

-- CreateIndex
CREATE INDEX "ChallengeTestCase_challengeId_idx" ON "ChallengeTestCase"("challengeId");

-- CreateIndex
CREATE INDEX "ChallengeTestCase_challengeId_order_idx" ON "ChallengeTestCase"("challengeId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_date_key" ON "DailyChallenge"("date");

-- CreateIndex
CREATE INDEX "DailyChallenge_challengeId_idx" ON "DailyChallenge"("challengeId");
