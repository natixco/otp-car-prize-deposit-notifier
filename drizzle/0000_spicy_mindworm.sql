DO $$ BEGIN
 CREATE TYPE "depositStatus" AS ENUM('pending', 'won');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deposit" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"series" varchar(255) NOT NULL,
	"number" varchar(255) NOT NULL,
	"status" "depositStatus"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP(3),
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "account" ("userId");