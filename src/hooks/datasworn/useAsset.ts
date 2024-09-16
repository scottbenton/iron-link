import { Datasworn, IdParser } from "@datasworn/core";
import { useDataswornTree } from "atoms/dataswornTree.atom";
import { useEffect, useState } from "react";

export function getAsset(
  assetId: string,
  tree: Record<string, Datasworn.RulesPackage>
): Datasworn.Asset | undefined {
  try {
    IdParser.tree = tree;
    const tmpAsset = IdParser.get(assetId);
    if ((tmpAsset as Datasworn.Asset).type === "asset") {
      return tmpAsset as Datasworn.Asset;
    }
  } catch {
    // Continue, just passing undefined instead
  }
  return undefined;
}

export function useAsset(assetId: string): Datasworn.Asset | undefined {
  const tree = useDataswornTree();
  const [asset, setAsset] = useState<Datasworn.Asset | undefined>(
    getAsset(assetId, tree)
  );

  useEffect(() => {
    setAsset(getAsset(assetId, tree));
  }, [assetId, tree]);

  return asset;
}
