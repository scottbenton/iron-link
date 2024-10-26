import { useMemo } from "react";
import { useAtomValue } from "jotai";

import { currentCharacterAtom } from "atoms/currentCharacter/currentCharacter.atom";
import { useImpactRules } from "atoms/dataswornRules/useImpactRules";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";

const impactAtom = derivedAtomWithEquality(
  currentCharacterAtom,
  (atom) => atom.character?.debilities ?? {},
);

export function useMomentumParameters() {
  const impacts = useAtomValue(impactAtom);
  const { impacts: impactRules } = useImpactRules();

  return useMemo(() => {
    let resetValue = 2;
    let max = 10;

    for (const [key, isActive] of Object.entries(impacts)) {
      if (isActive && impactRules[key]) {
        resetValue -= 1;
        max -= 1;
      }
      if (resetValue <= 0) {
        break;
      }
    }

    return {
      resetValue,
      max,
    };
  }, [impacts, impactRules]);
}
