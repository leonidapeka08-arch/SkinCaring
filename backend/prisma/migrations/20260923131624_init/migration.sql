-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emri" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "telefon" TEXT,
    "roli" TEXT NOT NULL DEFAULT 'klient',
    "dataKrijimit" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "dermatologists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "specializimi" TEXT NOT NULL,
    "bio" TEXT,
    "vitiEksperience" INTEGER,
    "fotoUrl" TEXT,
    "iVerifikuar" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "dermatologists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teksti" TEXT NOT NULL,
    "renditja" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "teksti" TEXT NOT NULL,
    "pikeThatesi" INTEGER NOT NULL DEFAULT 0,
    "pikeYndyre" INTEGER NOT NULL DEFAULT 0,
    "pikeNdjeshmeri" INTEGER NOT NULL DEFAULT 0,
    "pikeAkne" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "quiz_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quiz_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tipiLekure" TEXT NOT NULL,
    "problemet" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "face_scans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "aiAnaliza" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "face_scans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emri" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emri" TEXT NOT NULL,
    "pershkrimi" TEXT,
    "cmimi" REAL NOT NULL,
    "marka" TEXT,
    "kategoriaId" TEXT,
    "stoku" INTEGER NOT NULL DEFAULT 0,
    "tipiLekurePershtatshem" TEXT,
    CONSTRAINT "products_kategoriaId_fkey" FOREIGN KEY ("kategoriaId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "renditja" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emri" TEXT NOT NULL,
    "perfitimi" TEXT
);

-- CreateTable
CREATE TABLE "product_ingredients" (
    "productId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,

    PRIMARY KEY ("productId", "ingredientId"),
    CONSTRAINT "product_ingredients_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "product_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recommended_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizResultId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "arsyeja" TEXT,
    "renditjaHapi" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "recommended_products_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "quiz_results" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "recommended_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sasia" INTEGER NOT NULL DEFAULT 1,
    "dataShtimit" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totali" REAL NOT NULL,
    "statusi" TEXT NOT NULL DEFAULT 'pritje',
    "adresa" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sasia" INTEGER NOT NULL,
    "cmimiAthere" REAL NOT NULL,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tipiAgjenti" TEXT NOT NULL,
    "dataFillimit" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "dergues" TEXT NOT NULL,
    "permbajtja" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emri" TEXT NOT NULL,
    "pershkrimi" TEXT,
    "kohezgjatja" INTEGER,
    "cmimi" REAL NOT NULL,
    "tipi" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "dermatologist_services" (
    "dermatologistId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    PRIMARY KEY ("dermatologistId", "serviceId"),
    CONSTRAINT "dermatologist_services_dermatologistId_fkey" FOREIGN KEY ("dermatologistId") REFERENCES "dermatologists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "dermatologist_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dermatologist_availability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dermatologistId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "oraFillimit" TEXT NOT NULL,
    "oraMbarimit" TEXT NOT NULL,
    "iZene" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "dermatologist_availability_dermatologistId_fkey" FOREIGN KEY ("dermatologistId") REFERENCES "dermatologists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "klientId" TEXT NOT NULL,
    "dermatologistId" TEXT NOT NULL,
    "serviceId" TEXT,
    "data" DATETIME NOT NULL,
    "ora" TEXT NOT NULL,
    "statusi" TEXT NOT NULL DEFAULT 'pritje',
    CONSTRAINT "appointments_klientId_fkey" FOREIGN KEY ("klientId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appointments_dermatologistId_fkey" FOREIGN KEY ("dermatologistId") REFERENCES "dermatologists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dermatologist_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentId" TEXT NOT NULL,
    "teksti" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dermatologist_recommendations_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dermatologists_userId_key" ON "dermatologists"("userId");
