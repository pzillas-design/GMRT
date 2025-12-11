-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "contentBlocks" TEXT NOT NULL DEFAULT '[]',
    "location" TEXT NOT NULL DEFAULT 'Allgemein',
    "eventDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverImage" TEXT,
    "isLegacy" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Post" ("content", "contentBlocks", "createdAt", "eventDate", "id", "location", "title") SELECT "content", "contentBlocks", "createdAt", "eventDate", "id", "location", "title" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
