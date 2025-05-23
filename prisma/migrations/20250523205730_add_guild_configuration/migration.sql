-- CreateTable
CREATE TABLE "guild_configurations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "availabilityChannelId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "guild_configurations_id_key" ON "guild_configurations"("id");
