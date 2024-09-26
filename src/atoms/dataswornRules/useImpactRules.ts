import { Datasworn } from "@datasworn/core";
import { dataswornTreeAtom } from "atoms/dataswornTree.atom";
import { atom, useAtomValue } from "jotai";

const impactRulesAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);
  let impactCategories: Record<string, Datasworn.ImpactCategory> = {};
  let impacts: Record<string, Datasworn.ImpactRule> = {};

  Object.values(trees).forEach((tree) => {
    impactCategories = { ...impactCategories, ...(tree.rules?.impacts ?? {}) };
    Object.values(tree.rules?.impacts ?? {}).forEach((impactCategory) => {
      impacts = { ...impacts, ...(impactCategory.contents ?? {}) };
    });
  });
  return {
    impactCategories,
    impacts,
  };
});

export function useImpactRules() {
  return useAtomValue(impactRulesAtom);
}
