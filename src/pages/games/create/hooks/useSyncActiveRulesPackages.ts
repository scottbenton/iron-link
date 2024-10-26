import { useMemo } from "react";
import { Datasworn } from "@datasworn/core";

import { ICreateGameAtom } from "../atoms/createGame.atom";
import { useSetDataswornTree } from "atoms/dataswornTree.atom";
import {
  defaultBaseRulesets,
  defaultExpansions,
} from "data/datasworn.packages";

export function useSyncActiveRulesPackages(
  rulesets: ICreateGameAtom["rulesets"],
  expansions: ICreateGameAtom["expansions"],
) {
  const activeRulesPackages = useMemo(() => {
    const activePackages: Record<string, Datasworn.RulesPackage> = {};

    Object.entries(rulesets ?? {}).forEach(([id, isActive]) => {
      if (isActive) {
        activePackages[id] = defaultBaseRulesets[id];
        Object.entries(expansions?.[id] ?? {}).forEach(
          ([expansionId, isExpansionActive]) => {
            if (isExpansionActive) {
              activePackages[expansionId] = defaultExpansions[id][expansionId];
            }
          },
        );
      }
    });

    return activePackages;
  }, [rulesets, expansions]);

  useSetDataswornTree(activeRulesPackages);
}
