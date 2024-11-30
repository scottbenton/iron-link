import { useMemo } from "react";

import { useImpactRules } from "atoms/dataswornRules/useImpactRules";

import { useDerivedCurrentCharacterState } from "./useDerivedCharacterState";

export function useMomentumParameters() {
  const impacts = useDerivedCurrentCharacterState(
    (store) => store?.characterDocument.data?.debilities ?? {},
  );
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
