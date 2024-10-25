import { Datasworn } from "@datasworn/core";
import { atom, useAtomValue } from "jotai";

import { dataswornTreeAtom } from "atoms/dataswornTree.atom";

const conditionMeterRulesAtom = atom((get) => {
  const trees = get(dataswornTreeAtom);
  let conditionMeters: Record<string, Datasworn.ConditionMeterRule> = {};

  Object.values(trees).forEach((tree) => {
    conditionMeters = {
      ...conditionMeters,
      ...(tree.rules?.condition_meters ?? {}),
    };
  });
  return conditionMeters;
});

export function useConditionMeterRules() {
  return useAtomValue(conditionMeterRulesAtom);
}
