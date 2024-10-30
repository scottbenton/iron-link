import { useMemo } from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

import { AssetDocument } from "api-calls/assets/_asset.type";
import { CharacterDocument } from "api-calls/character/_character.type";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

export interface CharacterStore {
  characterDocument: {
    data?: CharacterDocument;
    loading: boolean;
    error?: string;
  };
  assets: {
    assets: Record<string, AssetDocument>;
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

export function useDerivedCampaignCharactersState<T>(
  select: (store: CampaignCharactersAtom) => T,
): T {
  return useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(campaignCharactersAtom, (state) =>
          select(state),
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    ),
  );
}
