'use server';

import { z } from 'zod/v4';

import { db } from '@/db/drizzle';
import { players } from '@/db/schema';

const schema = z.object({
  player1: z.string().min(1),
  player2: z.string().min(1),
});

export async function setupPlayer(
  _prevState: { message: string },
  formData: FormData,
) {
  const { success, data } = schema.safeParse(Object.fromEntries(formData));

  if (!success) {
    return { message: 'Invalid form data' };
  }

  await db
    .insert(players)
    .values([{ name: data.player1 }, { name: data.player2 }]);

  return { message: 'Player setup successful' };
}
