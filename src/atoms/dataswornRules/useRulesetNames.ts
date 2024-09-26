import { dataswornTreeAtom } from "atoms/dataswornTree.atom";
import { atom, useAtomValue } from "jotai";

const rulesetNameAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);

  const rulesetNames: Record<string, string> = {};

  Object.values(trees).forEach((tree) => {
    if (tree.type === "ruleset") {
      rulesetNames[tree._id] = tree.title;
    }
  });

  return rulesetNames;
});

export function useRulesetNames() {
  return useAtomValue(rulesetNameAtom);
}
