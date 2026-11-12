/*
  Warnings:

  - A unique constraint covering the columns `[emri]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emri]` on the table `ingredients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[renditja]` on the table `quiz_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ai_conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tipiAgjenti" TEXT NOT NULL,
    "dataFillimit" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ai_conversations" ("dataFillimit", "id", "tipiAgjenti", "userId") SELECT "dataFillimit", "id", "tipiAgjenti", "userId" FROM "ai_conversations";
DROP TABLE "ai_conversations";
ALTER TABLE "new_ai_conversations" RENAME TO "ai_conversations";
CREATE INDEX "ai_conversations_userId_idx" ON "ai_conversations"("userId");
CREATE TABLE "new_ai_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "dergues" TEXT NOT NULL,
    "permbajtja" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ai_messages" ("conversationId", "data", "dergues", "id", "permbajtja") SELECT "conversationId", "data", "dergues", "id", "permbajtja" FROM "ai_messages";
DROP TABLE "ai_messages";
ALTER TABLE "new_ai_messages" RENAME TO "ai_messages";
CREATE INDEX "ai_messages_conversationId_idx" ON "ai_messages"("conversationId");
CREATE TABLE "new_appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "klientId" TEXT NOT NULL,
    "dermatologistId" TEXT NOT NULL,
    "serviceId" TEXT,
    "data" DATETIME NOT NULL,
    "ora" TEXT NOT NULL,
    "statusi" TEXT NOT NULL DEFAULT 'pritje',
    CONSTRAINT "appointments_klientId_fkey" FOREIGN KEY ("klientId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointments_dermatologistId_fkey" FOREIGN KEY ("dermatologistId") REFERENCES "dermatologists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_appointments" ("data", "dermatologistId", "id", "klientId", "ora", "serviceId", "statusi") SELECT "data", "dermatologistId", "id", "klientId", "ora", "serviceId", "statusi" FROM "appointments";
DROP TABLE "appointments";
ALTER TABLE "new_appointments" RENAME TO "appointments";
CREATE INDEX "appointments_klientId_idx" ON "appointments"("klientId");
CREATE INDEX "appointments_dermatologistId_idx" ON "appointments"("dermatologistId");
CREATE INDEX "appointments_serviceId_idx" ON "appointments"("serviceId");
CREATE INDEX "appointments_data_idx" ON "appointments"("data");
CREATE INDEX "appointments_statusi_idx" ON "appointments"("statusi");
CREATE TABLE "new_cart_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sasia" INTEGER NOT NULL DEFAULT 1,
    "dataShtimit" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cart_items" ("dataShtimit", "id", "productId", "sasia", "userId") SELECT "dataShtimit", "id", "productId", "sasia", "userId" FROM "cart_items";
DROP TABLE "cart_items";
ALTER TABLE "new_cart_items" RENAME TO "cart_items";
CREATE INDEX "cart_items_userId_idx" ON "cart_items"("userId");
CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");
CREATE UNIQUE INDEX "cart_items_userId_productId_key" ON "cart_items"("userId", "productId");
CREATE TABLE "new_dermatologist_availability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dermatologistId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "oraFillimit" TEXT NOT NULL,
    "oraMbarimit" TEXT NOT NULL,
    "iZene" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "dermatologist_availability_dermatologistId_fkey" FOREIGN KEY ("dermatologistId") REFERENCES "dermatologists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_dermatologist_availability" ("data", "dermatologistId", "iZene", "id", "oraFillimit", "oraMbarimit") SELECT "data", "dermatologistId", "iZene", "id", "oraFillimit", "oraMbarimit" FROM "dermatologist_availability";
DROP TABLE "dermatologist_availability";
ALTER TABLE "new_dermatologist_availability" RENAME TO "dermatologist_availability";
CREATE INDEX "dermatologist_availability_dermatologistId_idx" ON "dermatologist_availability"("dermatologistId");
CREATE INDEX "dermatologist_availability_data_idx" ON "dermatologist_availability"("data");
CREATE TABLE "new_dermatologist_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentId" TEXT NOT NULL,
    "teksti" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dermatologist_recommendations_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_dermatologist_recommendations" ("appointmentId", "data", "id", "teksti") SELECT "appointmentId", "data", "id", "teksti" FROM "dermatologist_recommendations";
DROP TABLE "dermatologist_recommendations";
ALTER TABLE "new_dermatologist_recommendations" RENAME TO "dermatologist_recommendations";
CREATE INDEX "dermatologist_recommendations_appointmentId_idx" ON "dermatologist_recommendations"("appointmentId");
CREATE TABLE "new_dermatologist_services" (
    "dermatologistId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    PRIMARY KEY ("dermatologistId", "serviceId"),
    CONSTRAINT "dermatologist_services_dermatologistId_fkey" FOREIGN KEY ("dermatologistId") REFERENCES "dermatologists" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dermatologist_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_dermatologist_services" ("dermatologistId", "serviceId") SELECT "dermatologistId", "serviceId" FROM "dermatologist_services";
DROP TABLE "dermatologist_services";
ALTER TABLE "new_dermatologist_services" RENAME TO "dermatologist_services";
CREATE INDEX "dermatologist_services_serviceId_idx" ON "dermatologist_services"("serviceId");
CREATE TABLE "new_dermatologists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "specializimi" TEXT NOT NULL,
    "bio" TEXT,
    "vitiEksperience" INTEGER,
    "fotoUrl" TEXT,
    "iVerifikuar" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "dermatologists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_dermatologists" ("bio", "fotoUrl", "iVerifikuar", "id", "specializimi", "userId", "vitiEksperience") SELECT "bio", "fotoUrl", "iVerifikuar", "id", "specializimi", "userId", "vitiEksperience" FROM "dermatologists";
DROP TABLE "dermatologists";
ALTER TABLE "new_dermatologists" RENAME TO "dermatologists";
CREATE UNIQUE INDEX "dermatologists_userId_key" ON "dermatologists"("userId");
CREATE INDEX "dermatologists_iVerifikuar_idx" ON "dermatologists"("iVerifikuar");
CREATE TABLE "new_face_scans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "aiAnaliza" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "face_scans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_face_scans" ("aiAnaliza", "data", "id", "imageUrl", "userId") SELECT "aiAnaliza", "data", "id", "imageUrl", "userId" FROM "face_scans";
DROP TABLE "face_scans";
ALTER TABLE "new_face_scans" RENAME TO "face_scans";
CREATE INDEX "face_scans_userId_idx" ON "face_scans"("userId");
CREATE TABLE "new_order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sasia" INTEGER NOT NULL,
    "cmimiAthere" REAL NOT NULL,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_order_items" ("cmimiAthere", "id", "orderId", "productId", "sasia") SELECT "cmimiAthere", "id", "orderId", "productId", "sasia" FROM "order_items";
DROP TABLE "order_items";
ALTER TABLE "new_order_items" RENAME TO "order_items";
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totali" REAL NOT NULL,
    "statusi" TEXT NOT NULL DEFAULT 'pritje',
    "adresa" TEXT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("adresa", "data", "id", "statusi", "totali", "userId") SELECT "adresa", "data", "id", "statusi", "totali", "userId" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "orders_statusi_idx" ON "orders"("statusi");
CREATE INDEX "orders_data_idx" ON "orders"("data");
CREATE TABLE "new_product_images" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "renditja" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_product_images" ("id", "productId", "renditja", "url") SELECT "id", "productId", "renditja", "url" FROM "product_images";
DROP TABLE "product_images";
ALTER TABLE "new_product_images" RENAME TO "product_images";
CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");
CREATE TABLE "new_product_ingredients" (
    "productId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,

    PRIMARY KEY ("productId", "ingredientId"),
    CONSTRAINT "product_ingredients_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_ingredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_product_ingredients" ("ingredientId", "productId") SELECT "ingredientId", "productId" FROM "product_ingredients";
DROP TABLE "product_ingredients";
ALTER TABLE "new_product_ingredients" RENAME TO "product_ingredients";
CREATE INDEX "product_ingredients_ingredientId_idx" ON "product_ingredients"("ingredientId");
CREATE TABLE "new_quiz_options" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "teksti" TEXT NOT NULL,
    "pikeThatesi" INTEGER NOT NULL DEFAULT 0,
    "pikeYndyre" INTEGER NOT NULL DEFAULT 0,
    "pikeNdjeshmeri" INTEGER NOT NULL DEFAULT 0,
    "pikeAkne" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "quiz_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_quiz_options" ("id", "pikeAkne", "pikeNdjeshmeri", "pikeThatesi", "pikeYndyre", "questionId", "teksti") SELECT "id", "pikeAkne", "pikeNdjeshmeri", "pikeThatesi", "pikeYndyre", "questionId", "teksti" FROM "quiz_options";
DROP TABLE "quiz_options";
ALTER TABLE "new_quiz_options" RENAME TO "quiz_options";
CREATE INDEX "quiz_options_questionId_idx" ON "quiz_options"("questionId");
CREATE TABLE "new_quiz_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tipiLekure" TEXT NOT NULL,
    "problemet" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_quiz_results" ("data", "id", "problemet", "tipiLekure", "userId") SELECT "data", "id", "problemet", "tipiLekure", "userId" FROM "quiz_results";
DROP TABLE "quiz_results";
ALTER TABLE "new_quiz_results" RENAME TO "quiz_results";
CREATE INDEX "quiz_results_userId_idx" ON "quiz_results"("userId");
CREATE INDEX "quiz_results_tipiLekure_idx" ON "quiz_results"("tipiLekure");
CREATE TABLE "new_recommended_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizResultId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "arsyeja" TEXT,
    "renditjaHapi" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "recommended_products_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "quiz_results" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recommended_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_recommended_products" ("arsyeja", "id", "productId", "quizResultId", "renditjaHapi") SELECT "arsyeja", "id", "productId", "quizResultId", "renditjaHapi" FROM "recommended_products";
DROP TABLE "recommended_products";
ALTER TABLE "new_recommended_products" RENAME TO "recommended_products";
CREATE INDEX "recommended_products_productId_idx" ON "recommended_products"("productId");
CREATE INDEX "recommended_products_quizResultId_idx" ON "recommended_products"("quizResultId");
CREATE UNIQUE INDEX "recommended_products_quizResultId_productId_key" ON "recommended_products"("quizResultId", "productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "categories_emri_key" ON "categories"("emri");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_emri_key" ON "ingredients"("emri");

-- CreateIndex
CREATE INDEX "products_kategoriaId_idx" ON "products"("kategoriaId");

-- CreateIndex
CREATE INDEX "products_emri_idx" ON "products"("emri");

-- CreateIndex
CREATE INDEX "products_marka_idx" ON "products"("marka");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_questions_renditja_key" ON "quiz_questions"("renditja");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
