export type CharacterOrGameId =
  | { type: "character"; characterId: string }
  | { type: "game"; gameId: string };
