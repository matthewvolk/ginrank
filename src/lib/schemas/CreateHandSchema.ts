import { z } from 'zod/v4';

export const CreateHandSchema = z.object({
  gameId: z.string(),
  winnerId: z.string({ error: 'Please select a winner' }),
  points: z
    .number({ error: 'Points must be 0 or greater' })
    .min(0, { error: 'Points must be 0 or greater' }),
});
