ALTER TABLE "account" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "deposit" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "verificationToken" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'session'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "session" DROP CONSTRAINT "<constraint_name>";