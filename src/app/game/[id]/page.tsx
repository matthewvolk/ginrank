import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { CreateHand } from '@/components/create-hand';
import { db } from '@/db/drizzle';
import { games } from '@/db/schema';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  const game = await db.query.games.findFirst({
    where: eq(games.id, id),
    with: {
      settings: true,
      hands: true,
      players: {
        with: {
          player: true,
        },
      },
    },
  });

  if (!game) {
    notFound();
  }

  const players = game.players
    .map(({ player }) => player)
    .filter((player) => player !== null);

  return (
    <div className="flex flex-col gap-4">
      <CreateHand gameId={game.id} players={players} />
      <pre>{JSON.stringify(game, null, 2)}</pre>
    </div>
  );
}
