import { z } from 'zod/v4';

export const GameSetupSchema = z.object({
  player1: z
    .string({ error: 'Player 1 name is required' })
    .min(1, { error: 'Player 1 name is required' }),
  player2: z
    .string({ error: 'Player 2 name is required' })
    .min(1, { error: 'Player 2 name is required' }),
  pointValueCents: z.coerce
    .number()
    .min(1, { error: 'Point value must be greater than 0' }),
  boxValueCents: z.coerce
    .number()
    .min(1, { error: 'Box value must be greater than 0' }),
  winScore: z.coerce
    .number()
    .min(1, { error: 'Win score must be greater than 0' }),
});
