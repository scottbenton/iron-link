import { atom, useSetAtom } from "jotai";

import { CampaignType } from "api-calls/campaign/_campaign.type";

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
