-- CreateTable
CREATE TABLE "MeterReading" (
    "id" TEXT NOT NULL,
    "customerCode" TEXT NOT NULL,
    "measureType" TEXT NOT NULL,
    "measureDatetime" TIMESTAMP(3) NOT NULL,
    "measureValue" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeterReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MeterReading_customerCode_idx" ON "MeterReading"("customerCode");
