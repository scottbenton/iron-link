export enum LegacyTrackTypes {
  QUESTS = "quests",
  BONDS = "bonds",
  DISCOVERIES = "discoveries",
}
export interface LegacyTrack {
  value: number;
  spentExperience?: { [index: number]: boolean };
  isLegacy?: boolean;
}
