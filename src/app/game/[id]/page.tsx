import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { CreateHand } from '@/components/create-hand';
import { GameResults } from '@/components/game-results';
import { GameSettings } from '@/components/game-settings';
import { Scoresheet } from '@/components/scoresheet';
import { db } from '@/db/drizzle';
import {
  games,
  type SelectGameSettings,
  type SelectHand,
  type SelectPlayer,
} from '@/db/schema';

function buildScoresheet(
  players: SelectPlayer[],
  hands: SelectHand[],
  winScore: number,
) {
  const scoresheet = new Map<string, number[][]>(
    players.map((p) => [p.id, []]),
  );

  const totals = new Map<string, number[]>(
    players.map((p) => [p.id, [0, 0, 0]]),
  );

  for (const hand of hands) {
    const playerId = hand.winnerId;
    if (!playerId) continue;

    const playerCols = scoresheet.get(playerId)!;
    const playerTotals = totals.get(playerId)!;

    const opponentId = players.find((p) => p.id !== playerId)!.id;
    const opponentTotals = totals.get(opponentId)!;

    const activeCols = Math.min(playerCols.length + 1, 3);

    for (let i = 0; i < activeCols; i++) {
      if (!playerCols[i]) playerCols[i] = [];

      if (playerTotals[i] >= winScore || opponentTotals[i] >= winScore) {
        continue;
      }

      playerCols[i].push(hand.points);
      playerTotals[i] += hand.points;
    }
  }

  return scoresheet;
}

function accumulateUntilWin(values: number[], winScore: number) {
  let total = 0;
  let lastIndex = -1;

  for (let i = 0; i < values.length; i++) {
    total += values[i];
    if (total >= winScore) {
      lastIndex = i;
      break;
    }
  }

  if (lastIndex === -1) return null;

  return {
    points: total,
    boxes: lastIndex + 1,
    endIndex: lastIndex,
  };
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

    const p1Result = accumulateUntilWin(p1Col, settings.winScore);
    const p2Result = accumulateUntilWin(p2Col, settings.winScore);

    if (p1Result || p2Result) {
      const winnerId = p1Result ? p1 : p2;
      const winnerRes = p1Result ?? p2Result!;
      const loserCol = winnerId === p1 ? p2Col : p1Col;

      const winnerPoints = winnerRes.points;
      const winnerBoxes = winnerRes.boxes;

      const loserBoxes = Math.min(loserCol.length, winnerBoxes);

      const extraBoxes = Math.max(0, winnerBoxes - loserBoxes);
      const payout =
        winnerPoints * settings.pointValueCents +
        extraBoxes * settings.boxValueCents;

      results.push({
        winnerId,
        gameIndex,
        points: winnerPoints,
        boxes: extraBoxes,
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

  const scoresheet = buildScoresheet(
    players,
    game.hands,
    game.settings.winScore,
  );
  console.dir(scoresheet, { depth: null });
  const results = evaluateGames(scoresheet, game.settings);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CreateHand gameId={game.id} players={players} />
        <GameSettings settings={game.settings} />
      </div>
      <GameResults players={players} results={results} />
      <Scoresheet players={players} scoresheet={scoresheet} />
    </div>
  );
}
