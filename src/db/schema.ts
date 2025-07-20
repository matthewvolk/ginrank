import { sql } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const games = pgTable('games', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const hands = pgTable('hands', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  gameId: uuid('game_id')
    .notNull()
    .references(() => games.id, { onDelete: 'cascade' }),
  handNumber: integer('hand_number').notNull(),
  winnerId: uuid('winner_id')
    .notNull()
    .references(() => players.id),
  points: integer('points').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const gameSettings = pgTable('game_settings', {
  gameId: uuid('game_id')
    .primaryKey()
    .references(() => games.id, { onDelete: 'cascade' }),
  winScore: integer('win_score').notNull().default(100),
  pointValueCents: integer('point_value_cents').notNull().default(10),
  boxValueCents: integer('box_value_cents').notNull().default(200),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const gamePlayers = pgTable(
  'game_players',
  {
    gameId: uuid('game_id').references(() => games.id, { onDelete: 'cascade' }),
    playerId: uuid('player_id').references(() => players.id, {
      onDelete: 'cascade',
    }),
    joinedAt: timestamp('joined_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.gameId, table.playerId] })],
);

export const handPlayers = pgTable(
  'hand_players',
  {
    handId: uuid('hand_id').references(() => hands.id, { onDelete: 'cascade' }),
    playerId: uuid('player_id').references(() => players.id, {
      onDelete: 'cascade',
    }),
  },
  (table) => [primaryKey({ columns: [table.handId, table.playerId] })],
);
