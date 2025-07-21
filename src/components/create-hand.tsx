'use client';

import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod/v4';
import { useActionState } from 'react';

import { createHand } from '@/actions/createHand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectPlayer } from '@/db/schema';
import { CreateHandSchema } from '@/lib/schemas/CreateHandSchema';

interface CreateHandProps {
  gameId: string;
  players: SelectPlayer[];
}

export function CreateHand({ gameId, players }: CreateHandProps) {
  const [lastResult, action, pending] = useActionState(createHand, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateHandSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="rounded-md border p-4">
      <form
        {...getFormProps(form)}
        action={action}
        className="flex flex-col gap-4"
      >
        <input
          {...getInputProps(fields.gameId, { type: 'hidden' })}
          value={gameId}
        />
        <div className="flex flex-col gap-2">
          <Label>Select Winner</Label>
          {players.map((player) => (
            <Label
              className="flex items-center gap-2 text-base"
              key={player.id}
            >
              <input
                {...getInputProps(fields.winnerId, {
                  type: 'radio',
                  value: player.id,
                })}
              />
              {player.name}
            </Label>
          ))}
          <div
            aria-atomic="true"
            aria-live="polite"
            className="text-destructive text-sm font-medium"
            id={fields.winnerId.errorId}
          >
            {fields.winnerId.errors}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="points">Winner Score</Label>
          <Input
            className="h-12 text-lg md:text-lg"
            {...getInputProps(fields.points, { type: 'number' })}
          />
          <div
            aria-atomic="true"
            aria-live="polite"
            className="text-destructive text-sm font-medium"
            id={fields.points.errorId}
          >
            {fields.points.errors}
          </div>
        </div>
        <Button className="h-12 text-lg" disabled={pending} type="submit">
          {pending ? 'Logging...' : 'Log Hand'}
        </Button>
      </form>
    </div>
  );
}
