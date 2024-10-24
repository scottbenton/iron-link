import { Datasworn } from "@datasworn/core";
import { atom, useAtomValue } from "jotai";

import { dataswornTreeAtom } from "atoms/dataswornTree.atom";

const specialTrackRulesAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);
  let specialTracks: Record<string, Datasworn.SpecialTrackRule> = {};

  Object.values(trees).forEach((tree) => {
    specialTracks = { ...specialTracks, ...(tree.rules?.special_tracks ?? {}) };
  });
  return specialTracks;
});

export function useSpecialTrackRules() {
  return useAtomValue(specialTrackRulesAtom);
}
