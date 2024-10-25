import { AssetDocument } from "api-calls/assets/_asset.type";
import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { CharacterDocument } from "api-calls/character/_character.type";

export interface CampaignRollOptionState {
  conditionMeters: CampaignDocument["conditionMeters"];
  assets: Record<string, AssetDocument>;
}

export interface CharacterRollOptionState {
  name: string;
  stats: CharacterDocument["stats"];
  conditionMeters: CharacterDocument["conditionMeters"];
  adds: CharacterDocument["adds"];
  momentum: CharacterDocument["momentum"];
  assets: Record<string, AssetDocument>;
  specialTracks: CharacterDocument["specialTracks"];
}
