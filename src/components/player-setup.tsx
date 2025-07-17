'use client';

import { useActionState } from 'react';

import { setupPlayer } from '@/actions/setupPlayer';

const initialState = {
  message: '',
};

export function PlayerSetup() {
  const [state, formAction, pending] = useActionState(
    setupPlayer,
    initialState,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Player Setup</h1>
        <p className="italic">Add players to the game and set their names.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="player-name">Player 1</label>
          <input
            className="rounded-md border border-slate-300 p-2"
            name="player1"
            placeholder="Enter player name"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="player-name">Player 2</label>
          <input
            className="rounded-md border border-slate-300 p-2"
            name="player2"
            placeholder="Enter player name"
            type="text"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">{state.message}</p>
          <button
            className="w-fit self-end rounded-md bg-slate-900 px-4 py-2 font-medium text-white"
            disabled={pending}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
