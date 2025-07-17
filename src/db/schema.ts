import { sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  name: text('name').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
