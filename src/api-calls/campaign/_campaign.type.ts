import { LegacyTrack } from "types/LegacyTrack.type";

import { ColorScheme } from "atoms/theme.atom";

export enum CampaignType {
  Solo = "solo",
  Coop = "co-op",
  Guided = "guided",
}

export interface CampaignDocument {
  name: string;
  users: string[];
  characters: { uid: string; characterId: string }[];
  gmIds?: string[];
  worldId?: string;
  customTracks?: Record<string, number>;
  conditionMeters?: Record<string, number>;
  specialTracks?: Record<string, LegacyTrack>;
  type?: CampaignType;
  colorScheme?: ColorScheme;

  // To migrate
  rulesets: Record<string, boolean>;
  expansions: Record<string, Record<string, boolean>>;
}
