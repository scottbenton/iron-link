import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { Atom, useAtomValue } from "jotai";
import { useMemo } from "react";

export function useDerivedAtomState<A, T>(
  atom: Atom<A>,
  select: (atom: A) => T
): T {
  return useAtomValue(
    useMemo(
      () => derivedAtomWithEquality(atom, (state) => select(state)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [atom]
    )
  );
}
