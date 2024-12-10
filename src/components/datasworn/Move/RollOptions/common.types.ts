import { AssetDocument } from "api-calls/assets/_asset.type";
import { CampaignDocument } from "api-calls/campaign/_campaign.type";

import { CharacterDTO } from "repositories/character.repository";

export interface CampaignRollOptionState {
  conditionMeters: CampaignDocument["conditionMeters"];
  assets: Record<string, AssetDocument>;
}

export interface CharacterRollOptionState {
  name: string;
  stats: CharacterDTO["stats"];
  conditionMeters: CharacterDTO["conditionMeters"];
  adds: CharacterDTO["adds"];
  momentum: CharacterDTO["momentum"];
  assets: Record<string, AssetDocument>;
  specialTracks: CharacterDTO["specialTracks"];
}
