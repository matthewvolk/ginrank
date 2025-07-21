import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { CreateHand } from '@/components/create-hand';
import { Scoresheet } from '@/components/scoresheet';
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

  const players = game.players.map(({ player }) => player);

  return (
    <div className="flex flex-col gap-4">
      <CreateHand gameId={game.id} players={players} />
      <div className="flex flex-col gap-4 rounded-md border p-4">
        <h2 className="text-lg font-bold">Game Settings</h2>
        <pre>{JSON.stringify(game.settings, null, 2)}</pre>
      </div>
      <Scoresheet hands={game.hands} players={players} />
    </div>
  );
}
