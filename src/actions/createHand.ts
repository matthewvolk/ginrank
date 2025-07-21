'use server';

import { parseWithZod } from '@conform-to/zod/v4';
import { eq, max } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db/drizzle';
import { gamePlayers, handPlayers, hands } from '@/db/schema';
import { CreateHandSchema } from '@/lib/schemas/CreateHandSchema';

export async function createHand(_prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: CreateHandSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const { gameId, winnerId, points } = submission.value;

  const players = await db.query.gamePlayers.findMany({
    where: eq(gamePlayers.gameId, gameId),
  });

  const maxHandResult = await db
    .select({ maxHand: max(hands.handNumber) })
    .from(hands)
    .where(eq(hands.gameId, gameId));

  const handNumber = (maxHandResult[0]?.maxHand ?? 0) + 1;

  const [hand] = await db
    .insert(hands)
    .values({
      gameId,
      winnerId: points === 0 ? null : winnerId,
      points,
      handNumber,
    })
    .returning();

  await db.insert(handPlayers).values(
    players.map((player) => ({
      handId: hand.id,
      playerId: player.playerId,
    })),
  );

  revalidatePath(`/game/${gameId}`);
}
