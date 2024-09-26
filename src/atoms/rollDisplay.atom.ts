import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Roll } from "types/DieRolls.type";

export interface RollDisplay {
  [rollId: string]: Roll;
}
// addRoll: (rollId: string, roll: Roll) => void;
// clearRoll: (rollId: string) => void;
// clearRolls: () => void;

export const rollDisplayAtom = atom<RollDisplay>({});

export function useVisibleRolls() {
  return useAtomValue(rollDisplayAtom);
}

export function useAddRollSnackbar() {
  const setRolls = useSetAtom(rollDisplayAtom);

  const addRoll = useCallback(
    (rollId: string, roll: Roll) => {
      setRolls((rolls) => {
        const newRolls = { ...rolls };

        const newRollIds = Object.entries(newRolls)
          .sort(
            ([, r1], [, r2]) => r1.timestamp.getTime() - r2.timestamp.getTime()
          )
          .map(([rollId]) => rollId);

        if (newRollIds.length >= 3) {
          delete newRolls[newRollIds[0]];
        }

        newRolls[rollId] = roll;
        return newRolls;
      });
    },
    [setRolls]
  );

  return addRoll;
}

export function useClearRollSnackbar() {
  const setRolls = useSetAtom(rollDisplayAtom);

  const clearRoll = useCallback(
    (rollId: string) => {
      setRolls((rolls) => {
        const newRolls = { ...rolls };
        delete newRolls[rollId];
        return newRolls;
      });
    },
    [setRolls]
  );

  return clearRoll;
}

export function useClearAllRollSnackbars() {
  const setRolls = useSetAtom(rollDisplayAtom);

  const clearRolls = useCallback(() => {
    setRolls({});
  }, [setRolls]);

  return clearRolls;
}
