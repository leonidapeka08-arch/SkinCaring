CREATE TABLE "appointment_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "cmimiAthere" REAL NOT NULL,
    "kohezgjatjaAthere" INTEGER,
    CONSTRAINT "appointment_services_appointmentId_fkey"
        FOREIGN KEY ("appointmentId")
        REFERENCES "appointments" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointment_services_serviceId_fkey"
        FOREIGN KEY ("serviceId")
        REFERENCES "services" ("id")
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "appointment_services_appointmentId_idx"
ON "appointment_services"("appointmentId");

CREATE INDEX "appointment_services_serviceId_idx"
ON "appointment_services"("serviceId");

CREATE UNIQUE INDEX "appointment_services_appointmentId_serviceId_key"
ON "appointment_services"("appointmentId", "serviceId");