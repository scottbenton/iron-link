import { CharacterDTO } from "repositories/character.repository";

export interface CharacterRollOptionState {
  name: string;
  stats: CharacterDTO["stats"];
  conditionMeters: CharacterDTO["conditionMeters"];
  adds: CharacterDTO["adds"];
  momentum: CharacterDTO["momentum"];
  specialTracks: CharacterDTO["specialTracks"];
}
