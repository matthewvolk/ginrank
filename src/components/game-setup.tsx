'use client';

import { useActionState } from 'react';

import { setupGame } from '@/actions/setupGame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState = {
  message: '',
};

export function GameSetup() {
  const [state, formAction, pending] = useActionState(setupGame, initialState);

  return (
    <div className="rounded-md border p-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">Game Setup</h1>
          <p>Set player names and point values.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="player1">Player 1</Label>
              <Input
                name="player1"
                placeholder="Enter player name"
                type="text"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="player2">Player 2</Label>
              <Input
                name="player2"
                placeholder="Enter player name"
                type="text"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="pointValueCents">Point Value</Label>
              <Input
                defaultValue={10}
                name="pointValueCents"
                placeholder="Enter point value"
                type="number"
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label htmlFor="boxValueCents">Box Value</Label>
              <Input
                defaultValue={200}
                name="boxValueCents"
                placeholder="Enter box value"
                type="number"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="winScore">Win Score</Label>
            <Input
              defaultValue={100}
              name="winScore"
              placeholder="Enter win score"
              type="number"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">{state.message}</p>
            <Button disabled={pending} type="submit">
              {pending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
