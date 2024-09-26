import { CharacterDocument } from "api-calls/character/_character.type";
import { atom, useAtom, useSetAtom } from "jotai";

export interface CharacterStore {
  characterDocument: {
    data?: CharacterDocument;
    loading: boolean;
    error?: string;
  };
}

export interface CampaignCharactersAtom {
  [key: string]: CharacterStore;
}

export const campaignCharactersAtom = atom<CampaignCharactersAtom>({});

export function useCampaignCharactersAtom() {
  return useAtom(campaignCharactersAtom);
}

export function useSetCampaignCharacters() {
  return useSetAtom(campaignCharactersAtom);
}
