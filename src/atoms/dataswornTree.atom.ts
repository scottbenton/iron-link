import { Datasworn } from "@datasworn/core";
import { ironLinkAskTheOracleRulesPackage } from "data/askTheOracle";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";

export const dataswornTreeAtom = atom<Record<string, Datasworn.RulesPackage>>(
  {}
);

export function useDataswornTree() {
  return useAtomValue(dataswornTreeAtom);
}

export function useSetDataswornTree(
  tree: Record<string, Datasworn.RulesPackage>
) {
  const setTree = useSetAtom(dataswornTreeAtom);
  useEffect(() => {
    setTree({
      [ironLinkAskTheOracleRulesPackage._id]: ironLinkAskTheOracleRulesPackage,
      ...tree,
    });
  }, [tree, setTree]);
}

export function useDataswornTreeSetter() {
  const setTree = useSetAtom(dataswornTreeAtom);
  return useCallback(
    (tree: Record<string, Datasworn.RulesPackage>) => {
      setTree({
        [ironLinkAskTheOracleRulesPackage._id]:
          ironLinkAskTheOracleRulesPackage,
        ...tree,
      });
    },
    [setTree]
  );
}
