import { Datasworn, IdParser } from "@datasworn/core";
import { useEffect, useState } from "react";

import { useDataswornTree } from "atoms/dataswornTree.atom";

export function getMove(
  moveId: string,
  tree: Record<string, Datasworn.RulesPackage>,
): Datasworn.Move | undefined {
  try {
    IdParser.tree = tree;
    const tmpMove = IdParser.get(moveId) as Datasworn.Move;
    if (tmpMove.type === "move") {
      return tmpMove;
    }
  } catch {
    // Continue, just passing undefined instead
  }
  return undefined;
}

export function useMove(moveId: string): Datasworn.Move | undefined {
  const tree = useDataswornTree();
  const [move, setMove] = useState<Datasworn.Move | undefined>(
    getMove(moveId, tree),
  );

  useEffect(() => {
    setMove(getMove(moveId, tree));
  }, [moveId, tree]);

  return move;
}
