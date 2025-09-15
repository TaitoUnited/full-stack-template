ALTER TABLE "session" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "refresh_token_expires_at" timestamp with time zone;