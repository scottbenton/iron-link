import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

interface DataswornDialogAtomState {
  isOpen: boolean;
  openId?: string;
  previousIds: string[];
}
export const dataswornDialogAtom = atom<DataswornDialogAtomState>({
  isOpen: false,
  previousIds: [],
});

export function useDataswornDialogState() {
  return useAtomValue(dataswornDialogAtom);
}

export function useOpenDataswornDialog() {
  const setDataswornDialogState = useSetAtom(dataswornDialogAtom);
  return useCallback(
    (id: string) => {
      setDataswornDialogState((prev) => {
        if (prev.isOpen) {
          return {
            isOpen: true,
            openId: id,
            previousIds: prev.openId
              ? [...prev.previousIds, prev.openId]
              : prev.previousIds,
          };
        } else {
          return {
            isOpen: true,
            openId: id,
            previousIds: [],
          };
        }
      });
    },
    [setDataswornDialogState],
  );
}

export function useCloseDataswornDialog() {
  const setDataswornDialogState = useSetAtom(dataswornDialogAtom);
  return useCallback(() => {
    setDataswornDialogState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, [setDataswornDialogState]);
}

export function usePrevDataswornDialog() {
  const setDataswornDialogState = useSetAtom(dataswornDialogAtom);
  return useCallback(() => {
    setDataswornDialogState((prev) => {
      if (prev.previousIds.length > 0) {
        const previousIds = [...prev.previousIds];
        const newOpenId = previousIds.pop();
        return {
          openId: newOpenId,
          previousIds,
          isOpen: true,
        };
      } else {
        return prev;
      }
    });
  }, [setDataswornDialogState]);
}
