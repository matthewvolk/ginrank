ALTER TABLE "hands" DROP CONSTRAINT "hands_hand_number_unique";--> statement-breakpoint
ALTER TABLE "hands" ADD CONSTRAINT "hands_game_id_hand_number_unique" UNIQUE("game_id","hand_number");