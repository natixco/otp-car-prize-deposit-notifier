ALTER TABLE "session" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "session" ADD PRIMARY KEY ("sessionToken");--> statement-breakpoint