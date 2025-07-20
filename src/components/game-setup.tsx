'use client';

import { useActionState } from 'react';

import { setupGame } from '@/actions/setupGame';

const initialState = {
  message: '',
};

export function GameSetup() {
  const [state, formAction, pending] = useActionState(setupGame, initialState);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Player Setup</h1>
        <p className="italic">Add players to the game and set their names.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="player1">Player 1</label>
          <input
            className="rounded-md border border-slate-300 p-2"
            name="player1"
            placeholder="Enter player name"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="player2">Player 2</label>
          <input
            className="rounded-md border border-slate-300 p-2"
            name="player2"
            placeholder="Enter player name"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="pointValueCents">Point Value</label>
          <input
            className="rounded-md border border-slate-300 p-2"
            defaultValue={10}
            name="pointValueCents"
            placeholder="Enter point value"
            type="number"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="boxValueCents">Box Value</label>
          <input
            className="rounded-md border border-slate-300 p-2"
            defaultValue={200}
            name="boxValueCents"
            placeholder="Enter box value"
            type="number"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="winScore">Win Score</label>
          <input
            className="rounded-md border border-slate-300 p-2"
            defaultValue={100}
            name="winScore"
            placeholder="Enter win score"
            type="number"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-semibold">{state.message}</p>
          <button
            className="w-fit self-end rounded-md bg-slate-900 px-4 py-2 font-medium text-white"
            disabled={pending}
            type="submit"
          >
            {pending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
