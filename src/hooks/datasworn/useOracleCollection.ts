import { useEffect, useState } from "react";
import { Datasworn, IdParser } from "@datasworn/core";

import { useDataswornTree } from "atoms/dataswornTree.atom";

export function getOracleCollection(
  oracleCollectionId: string,
  tree: Record<string, Datasworn.RulesPackage>,
): Datasworn.OracleCollection | undefined {
  try {
    IdParser.tree = tree;
    const tmpOracleCollection = IdParser.get(oracleCollectionId);
    if (
      (tmpOracleCollection as Datasworn.OracleCollection).type ===
      "oracle_collection"
    ) {
      return tmpOracleCollection as Datasworn.OracleCollection;
    }
  } catch {
    // Continue, just passing undefined instead
  }
  return undefined;
}

export function useOracleCollection(
  oracleCollectionId: string,
): Datasworn.OracleCollection | undefined {
  const tree = useDataswornTree();
  const [oracleCollection, setOracleCollection] = useState<
    Datasworn.OracleCollection | undefined
  >(getOracleCollection(oracleCollectionId, tree));

  useEffect(() => {
    setOracleCollection(getOracleCollection(oracleCollectionId, tree));
  }, [oracleCollectionId, tree]);

  return oracleCollection;
}
