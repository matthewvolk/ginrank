import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { CreateHand } from '@/components/create-hand';
import { Scoresheet } from '@/components/scoresheet';
import { db } from '@/db/drizzle';
import {
  games,
  type SelectGameSettings,
  type SelectHand,
  type SelectPlayer,
} from '@/db/schema';

function buildScoresheet(players: SelectPlayer[], hands: SelectHand[]) {
  const scoresheet = new Map<string, number[][]>(
    players.map((player) => [player.id, []]),
  );

  for (const hand of hands) {
    const playerId = hand.winnerId;

    if (playerId) {
      const playerScores = scoresheet.get(playerId);

      if (playerScores) {
        if (playerScores.length === 0) {
          playerScores.push([hand.points]);
        } else if (playerScores.length === 1) {
          playerScores[0].push(hand.points);
          playerScores.push([hand.points]);
        } else if (playerScores.length === 2) {
          playerScores[0].push(hand.points);
          playerScores[1].push(hand.points);
          playerScores.push([hand.points]);
        } else {
          playerScores[0].push(hand.points);
          playerScores[1].push(hand.points);
          playerScores[2].push(hand.points);
        }
      }
    }
  }

  return scoresheet;
}

function evaluateGames(
  scoresheet: Map<string, number[][]>,
  settings: SelectGameSettings,
) {
  const playerIds = Array.from(scoresheet.keys());
  if (playerIds.length !== 2) {
    throw new Error('This logic assumes exactly 2 players for now');
  }

  const [p1, p2] = playerIds;
  const results = [];

  for (let gameIndex = 0; gameIndex < 3; gameIndex++) {
    const p1Col = scoresheet.get(p1)?.[gameIndex] ?? [];
    const p2Col = scoresheet.get(p2)?.[gameIndex] ?? [];

    const p1Points = p1Col.reduce((a, b) => a + b, 0);
    const p2Points = p2Col.reduce((a, b) => a + b, 0);

    if (p1Points >= settings.winScore || p2Points >= settings.winScore) {
      const winnerId = p1Points >= settings.winScore ? p1 : p2;

      const winnerCol = winnerId === p1 ? p1Col : p2Col;
      const loserCol = winnerId === p1 ? p2Col : p1Col;

      const winnerPoints = winnerCol.reduce((a, b) => a + b, 0);
      const winnerHands = winnerCol.length;
      const loserHands = loserCol.length;

      const boxes = Math.max(0, winnerHands - loserHands);
      const payout =
        winnerPoints * settings.pointValueCents +
        boxes * settings.boxValueCents;

      results.push({
        winnerId,
        gameIndex,
        points: winnerPoints,
        boxes,
        payout,
      });
    }
  }

  return results;
}

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

  const scoresheet = buildScoresheet(players, game.hands);
  const results = evaluateGames(scoresheet, game.settings);

  return (
    <div className="flex flex-col gap-4">
      <CreateHand gameId={game.id} players={players} />
      <div className="flex flex-col gap-4 rounded-md border p-4">
        <h2 className="text-lg font-bold">Game Results</h2>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
      <div className="flex flex-col gap-4 rounded-md border p-4">
        <h2 className="text-lg font-bold">Game Settings</h2>
        <pre>{JSON.stringify(game.settings, null, 2)}</pre>
      </div>
      <Scoresheet players={players} scoresheet={scoresheet} />
    </div>
  );
}
