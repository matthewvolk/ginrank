import { GameSetup } from '@/components/game-setup';
import { Rank } from '@/components/rank';

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <GameSetup />
      <Rank />
    </div>
  );
}
