import { drizzle } from 'drizzle-orm/postgres-js';

import * as relations from '@/db/relations';
import * as schema from '@/db/schema';
import { env } from '@/env';

export const db = drizzle(env.DATABASE_URL, {
  schema: { ...schema, ...relations },
});
