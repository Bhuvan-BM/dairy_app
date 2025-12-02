-- CreateTable
CREATE TABLE "Farmer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RateChart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "animalType" TEXT NOT NULL,
    "fat" REAL NOT NULL,
    "snf" REAL NOT NULL,
    "rate" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "farmerId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "shift" TEXT NOT NULL,
    "animalType" TEXT NOT NULL,
    "fat" REAL NOT NULL,
    "snf" REAL NOT NULL,
    "quantity" REAL NOT NULL,
    "rate" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Collection_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_code_key" ON "Farmer"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RateChart_animalType_fat_snf_key" ON "RateChart"("animalType", "fat", "snf");
