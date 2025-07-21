ALTER TABLE "hands" ALTER COLUMN "winner_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hands" ADD CONSTRAINT "hands_hand_number_unique" UNIQUE("hand_number");