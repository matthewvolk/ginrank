'use client';

import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod/v4';
import { useActionState } from 'react';

import { setupGame } from '@/actions/setupGame';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GameSetupSchema } from '@/lib/schemas/GameSetupSchema';

export function GameSetup() {
  const [lastResult, action, pending] = useActionState(setupGame, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: GameSetupSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-md border p-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold">Game Setup</h1>
            <p>Set player names and point values.</p>
          </div>

          <form
            {...getFormProps(form)}
            action={action}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <div className="flex w-full flex-col gap-2">
                <Label htmlFor="player1">Player 1</Label>
                <Input
                  {...getInputProps(fields.player1, { type: 'text' })}
                  className="h-12 text-lg md:text-lg"
                  placeholder="Enter Player Name"
                />
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className="text-destructive text-sm font-medium"
                  id={fields.player1.errorId}
                >
                  {fields.player1.errors}
                </div>
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label htmlFor="player2">Player 2</Label>
                <Input
                  {...getInputProps(fields.player2, { type: 'text' })}
                  className="h-12 text-lg md:text-lg"
                  placeholder="Enter Player Name"
                />
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className="text-destructive text-sm font-medium"
                  id={fields.player2.errorId}
                >
                  {fields.player2.errors}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex w-full flex-col gap-2">
                <Label htmlFor="pointValueCents">Point Value</Label>
                <Input
                  {...getInputProps(fields.pointValueCents, { type: 'number' })}
                  className="h-12 text-lg md:text-lg"
                  defaultValue={10}
                  placeholder="Enter Point Value"
                />
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className="text-destructive text-sm font-medium"
                  id={fields.pointValueCents.errorId}
                >
                  {fields.pointValueCents.errors}
                </div>
              </div>
              <div className="flex w-full flex-col gap-2">
                <Label htmlFor="boxValueCents">Box Value</Label>
                <Input
                  {...getInputProps(fields.boxValueCents, { type: 'number' })}
                  className="h-12 text-lg md:text-lg"
                  defaultValue={200}
                  placeholder="Enter Box Value"
                />
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className="text-destructive text-sm font-medium"
                  id={fields.boxValueCents.errorId}
                >
                  {fields.boxValueCents.errors}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="winScore">Win Score</Label>
              <Input
                {...getInputProps(fields.winScore, { type: 'number' })}
                className="h-12 text-lg md:text-lg"
                defaultValue={100}
                placeholder="Enter Win Score"
              />
              <div
                aria-atomic="true"
                aria-live="polite"
                className="text-destructive text-sm font-medium"
                id={fields.winScore.errorId}
              >
                {fields.winScore.errors}
              </div>
            </div>
            <Button className="h-12 text-lg" disabled={pending} type="submit">
              {pending ? 'Starting...' : 'Start Game'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
