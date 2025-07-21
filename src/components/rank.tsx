import { db } from '@/db/drizzle';

export async function Rank() {
  const hands = await db.query.hands.findMany();
  const players = await db.query.players.findMany();
  const winCounts = new Map<string, number>();

  for (const hand of hands) {
    if (!hand.winnerId) continue;
    const winner = players.find((p) => p.id === hand.winnerId);
    if (!winner) continue;
    const name = winner.name;
    winCounts.set(name, (winCounts.get(name) ?? 0) + 1);
  }

  const ranked = Array.from(winCounts.entries())
    .map(([name, wins]) => ({ name, wins }))
    .sort((a, b) => b.wins - a.wins);

  return (
    <div className="mx-auto w-md">
      <div className="flex flex-col gap-4 rounded-md border p-4">
        <h2 className="text-lg font-bold">Leaderboard</h2>
        <ul className="flex flex-col gap-2">
          {ranked.length === 0 ? (
            <li>No wins yet.</li>
          ) : (
            ranked.map((player, index) => (
              <li
                className="bg-accent flex justify-between rounded-md px-4 py-2"
                key={player.name}
              >
                <span className="font-bold">
                  #{index + 1} {player.name}
                </span>
                <span>
                  {player.wins} hand{player.wins !== 1 ? 's' : ''} won
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
