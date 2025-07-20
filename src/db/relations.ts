import { relations } from 'drizzle-orm';

import {
  players,
  games,
  gameSettings,
  gamePlayers,
  hands,
  handPlayers,
} from '@/db/schema';

export const playerRelations = relations(players, ({ many }) => ({
  handsWon: many(hands, { relationName: 'player_wins' }),
  games: many(gamePlayers),
  handAppearances: many(handPlayers),
}));

export const gameRelations = relations(games, ({ one, many }) => ({
  settings: one(gameSettings, {
    fields: [games.id],
    references: [gameSettings.gameId],
  }),
  hands: many(hands),
  players: many(gamePlayers),
}));

export const gameSettingsRelations = relations(gameSettings, ({ one }) => ({
  game: one(games, {
    fields: [gameSettings.gameId],
    references: [games.id],
  }),
}));

export const handRelations = relations(hands, ({ one, many }) => ({
  game: one(games, {
    fields: [hands.gameId],
    references: [games.id],
  }),
  winner: one(players, {
    fields: [hands.winnerId],
    references: [players.id],
    relationName: 'player_wins',
  }),
  participants: many(handPlayers),
}));

export const gamePlayersRelations = relations(gamePlayers, ({ one }) => ({
  game: one(games, {
    fields: [gamePlayers.gameId],
    references: [games.id],
  }),
  player: one(players, {
    fields: [gamePlayers.playerId],
    references: [players.id],
  }),
}));

export const handPlayersRelations = relations(handPlayers, ({ one }) => ({
  hand: one(hands, {
    fields: [handPlayers.handId],
    references: [hands.id],
  }),
  player: one(players, {
    fields: [handPlayers.playerId],
    references: [players.id],
  }),
}));
