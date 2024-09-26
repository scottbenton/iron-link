import { CampaignType } from "api-calls/campaign/_campaign.type";
import { atom, useSetAtom } from "jotai";

export interface ICreateGameAtom {
  gameName: string;
  gameType: CampaignType;
  rulesets: Record<string, boolean>;
  expansions: Record<string, Record<string, boolean>>;
}

export const defaultState = {
  gameName: "",
  gameType: CampaignType.Solo,
  rulesets: {},
  expansions: {},
};

export const createGameAtom = atom<ICreateGameAtom>(defaultState);

export function useSetCreateGameAtom() {
  return useSetAtom(createGameAtom);
}
