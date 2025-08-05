import type { SelectGameSettings } from '@/db/schema';

interface GameSettingsProps {
  settings: SelectGameSettings;
}

export function GameSettings({ settings }: GameSettingsProps) {
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="rounded-md border p-4">
      <h2 className="mb-4 text-lg font-bold">Game Settings</h2>

      <div className="space-y-3">
        <div className="bg-muted/30 rounded-lg p-3">
          <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
            Target Score
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">{settings.winScore}</span>
            <span className="text-muted-foreground text-sm">points to win</span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
            Point Value
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(settings.pointValueCents)}
            </span>
            <span className="text-muted-foreground text-sm">per point</span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <h3 className="text-muted-foreground mb-1 text-sm font-semibold">
            Box Bonus
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(settings.boxValueCents)}
            </span>
            <span className="text-muted-foreground text-sm">per box</span>
          </div>
        </div>
      </div>
    </div>
  );
}
