CREATE TABLE "Tenant" (
	"id" TEXT PRIMARY KEY,
	"name" TEXT NOT NULL
);

CREATE TABLE "Condition" (
	"id" TEXT,
	"publicId" INTEGER,
	"name" TEXT NOT NULL,
	"tenantId" TEXT REFERENCES "Tenant"("id")
);

CREATE TABLE "DamageLocation" (
	"id" TEXT,
	"publicId" INTEGER,
	"name" TEXT NOT NULL,
	"tenantId" TEXT REFERENCES "Tenant"("id")
);

CREATE TABLE "Location" (
	"id" TEXT,
	"publicId" INTEGER,
	"name" TEXT NOT NULL,
	"tenantId" TEXT REFERENCES "Tenant"("id")
);

CREATE TABLE "files" (
	"id" TEXT PRIMARY KEY,
	"name" TEXT NOT NULL,
	"mimeType" TEXT NOT NULL,
	"size" INTEGER NOT NULL,
	"path" TEXT NOT NULL,
	"createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"tenantId" TEXT NOT NULL REFERENCES "Tenant"("id")
);

-- The tenant ID is a constant in src/main.ts. The foreign keys need this row.
INSERT INTO "Tenant" ("id", "name") VALUES ('01976ed4-b771-700a-b1e8-a1e898e5451d', 'Default');
