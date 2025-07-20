import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

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
      players: {
        with: {
          player: true,
        },
      },
      settings: true,
    },
  });

  if (!game) {
    notFound();
  }

  return (
    <main>
      <pre>{JSON.stringify(game, null, 2)}</pre>
    </main>
  );
}
