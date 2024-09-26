import { Datasworn } from "@datasworn/core";
import { dataswornTreeAtom } from "atoms/dataswornTree.atom";
import { atom, useAtomValue } from "jotai";

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
