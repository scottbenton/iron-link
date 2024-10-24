import { useEffect, useState } from "react";
import { Datasworn, IdParser } from "@datasworn/core";

import { useDataswornTree } from "atoms/dataswornTree.atom";

export function getOracleRollable(
  oracleRollableId: string,
  tree: Record<string, Datasworn.RulesPackage>,
): Datasworn.OracleRollable | undefined {
  try {
    IdParser.tree = tree;
    const tmpOracleRollable = IdParser.get(oracleRollableId);
    if (
      (tmpOracleRollable as Datasworn.OracleRollable).type === "oracle_rollable"
    ) {
      return tmpOracleRollable as Datasworn.OracleRollable;
    }
  } catch {
    // Continue, just passing undefined instead
  }
  return undefined;
}

export function useOracleRollable(
  oracleRollableId: string,
): Datasworn.OracleRollable | undefined {
  const tree = useDataswornTree();
  const [oracleRollable, setOracleRollable] = useState<
    Datasworn.OracleRollable | undefined
  >(getOracleRollable(oracleRollableId, tree));

  useEffect(() => {
    setOracleRollable(getOracleRollable(oracleRollableId, tree));
  }, [oracleRollableId, tree]);

  return oracleRollable;
}
