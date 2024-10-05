import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { Roll } from "types/DieRolls.type";

export type RollDisplay = { id?: string; roll: Roll }[];

// addRoll: (rollId: string, roll: Roll) => void;
// clearRoll: (rollId: string) => void;
// clearRolls: () => void;

export const rollDisplayAtom = atom<RollDisplay>([]);

export function useVisibleRolls() {
  return useAtomValue(rollDisplayAtom);
}

export function useAddRollSnackbar() {
  const setRolls = useSetAtom(rollDisplayAtom);

  const addRoll = useCallback(
    (rollId: string | undefined, roll: Roll) => {
      setRolls((rolls) => {
        const newRolls = [...rolls, { rollId, roll }];

        if (newRolls.length > 3) {
          newRolls.splice(0, 1);
        }

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
    (rollIndex: number) => {
      setRolls((rolls) => {
        const newRolls = [...rolls];
        newRolls.splice(rollIndex, 1);
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
    setRolls([]);
  }, [setRolls]);

  return clearRolls;
}
