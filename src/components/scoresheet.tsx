import { SelectHand, SelectPlayer } from '@/db/schema';

interface ScoresheetProps {
  players: SelectPlayer[];
  hands: SelectHand[];
}

export async function Scoresheet({ players, hands }: ScoresheetProps) {
  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <h2 className="text-lg font-bold">Scoresheet</h2>
      <pre>{JSON.stringify({ players, hands }, null, 2)}</pre>
    </div>
  );
}
