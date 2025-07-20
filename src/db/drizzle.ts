import { drizzle } from 'drizzle-orm/postgres-js';

import * as relations from './relations';
import * as schema from './schema';

import { env } from '@/env';

export const db = drizzle(env.DATABASE_URL, {
  schema: { ...schema, ...relations },
});
