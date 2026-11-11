-- CreateTable
CREATE TABLE "Series" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT NOT NULL DEFAULT 'Lainnya',
    "totalEpisodes" INTEGER NOT NULL,
    "watched" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'plan',
    "rating" INTEGER NOT NULL DEFAULT 0,
    "review" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);
