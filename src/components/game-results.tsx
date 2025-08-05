import type { SelectPlayer } from '@/db/schema';

interface GameResult {
  winnerId: string;
  gameIndex: number;
  points: number;
  boxes: number;
  payout: number;
}

interface GameResultsProps {
  players: SelectPlayer[];
  results: GameResult[];
}

export function GameResults({ players, results }: GameResultsProps) {
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name ?? 'Unknown Player';
  };

  if (results.length === 0) {
    return (
      <div className="rounded-md border p-4">
        <h2 className="mb-4 text-lg font-bold">Game Results</h2>
        <p className="text-muted-foreground">No completed games yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border p-4">
      <h2 className="mb-4 text-lg font-bold">Game Results</h2>
      <div className="flex flex-col gap-3">
        {results.map((result, index) => (
          <div
            className="bg-muted/30 rounded-md p-3"
            key={`${result.gameIndex}-${index}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Game {result.gameIndex + 1}</h3>
                <p className="text-muted-foreground text-sm">
                  Winner: {getPlayerName(result.winnerId)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(result.payout)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {result.points} pts, {result.boxes} boxes
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
