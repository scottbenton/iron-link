import { Atom } from "jotai";
import { selectAtom } from "jotai/utils";
import { isEqual } from "lodash";

export function derivedAtomWithEquality<AtomState, Slice>(
  atom: Atom<AtomState>,
  selector: (state: AtomState) => Slice,
): Atom<Slice> {
  return selectAtom(atom, selector, isEqual);
}
