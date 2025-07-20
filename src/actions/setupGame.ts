'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod/v4';

import { db } from '@/db/drizzle';
import { gamePlayers, games, gameSettings, players } from '@/db/schema';

const schema = z.object({
  player1: z.string().min(1),
  player2: z.string().min(1),
  pointValueCents: z.coerce.number().min(1),
  boxValueCents: z.coerce.number().min(1),
  winScore: z.coerce.number().min(1),
});

export async function setupGame(
  _prevState: { message: string },
  formData: FormData,
) {
  const { success, data, error } = schema.safeParse(
    Object.fromEntries(formData),
  );

  if (!success) {
    console.error(error);
    return { message: 'Invalid form data' };
  }

  const [player1, player2] = await db
    .insert(players)
    .values([{ name: data.player1 }, { name: data.player2 }])
    .returning({ id: players.id });

  const [game] = await db.insert(games).values({}).returning({ id: games.id });

  await db.insert(gameSettings).values({
    gameId: game.id,
    pointValueCents: data.pointValueCents,
    boxValueCents: data.boxValueCents,
    winScore: data.winScore,
  });

  await db.insert(gamePlayers).values([
    {
      gameId: game.id,
      playerId: player1.id,
    },
    {
      gameId: game.id,
      playerId: player2.id,
    },
  ]);

  redirect(`/game/${game.id}`);
}
