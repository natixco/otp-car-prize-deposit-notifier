DROP INDEX IF EXISTS "userId_idx";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP COLUMN IF EXISTS "id";
ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint