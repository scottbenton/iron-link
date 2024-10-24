import { Datasworn } from "@datasworn/core";
import { atom, useAtomValue } from "jotai";

import { dataswornTreeAtom } from "atoms/dataswornTree.atom";

const statRulesAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);
  let stats: Record<string, Datasworn.StatRule> = {};

  Object.values(trees).forEach((tree) => {
    stats = { ...stats, ...(tree.rules?.stats ?? {}) };
  });
  return stats;
});

export function useStatRules() {
  return useAtomValue(statRulesAtom);
}
