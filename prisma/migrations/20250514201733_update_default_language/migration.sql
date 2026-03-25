-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flashcard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "examples" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'German',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewed" DATETIME,
    "reviewCount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Flashcard" ("createdAt", "examples", "id", "language", "lastReviewed", "meaning", "reviewCount", "word") SELECT "createdAt", "examples", "id", "language", "lastReviewed", "meaning", "reviewCount", "word" FROM "Flashcard";
DROP TABLE "Flashcard";
ALTER TABLE "new_Flashcard" RENAME TO "Flashcard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
