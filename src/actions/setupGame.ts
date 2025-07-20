'use server';

import { parseWithZod } from '@conform-to/zod/v4';
import { redirect } from 'next/navigation';

import { db } from '@/db/drizzle';
import { gamePlayers, games, gameSettings, players } from '@/db/schema';
import { GameSetupSchema } from '@/lib/schemas/GameSetupSchema';

export async function setupGame(_prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: GameSetupSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const data = submission.value;

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
