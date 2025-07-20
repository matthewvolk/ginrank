import { GameSetup } from '@/components/game-setup';

export default function Home() {
  return (
    <main>
      <header className="flex flex-col gap-2 pb-4">
        <h1 className="text-2xl font-bold">Two Bucks a Box</h1>
        <p className="italic">
          Hollywood score keeping and bet tracking application for the card game
          Gin.
        </p>
      </header>

      <GameSetup />
    </main>
  );
}
