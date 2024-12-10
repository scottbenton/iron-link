import { Datasworn, IdParser } from "@datasworn/core";
import { Primary } from "@datasworn/core/dist/StringId";
import { useMemo } from "react";

import { getAsset } from "hooks/datasworn/useAsset";

import { useDataswornTree } from "stores/dataswornTree.store";

import { useActiveAssets } from "./useActiveAssets";

export interface Enhancement {
  assetId: string;
  assetName: string;
  enhancement: Datasworn.MoveEnhancement;
}

export function useActiveAssetMoveEnhancements(moveId: string): Enhancement[] {
  const { characterAssetDocuments, campaignAssetDocuments } = useActiveAssets();

  const tree = useDataswornTree();

  const activeAssetMoveEnhancements = useMemo(() => {
    const moveEnhancements: Enhancement[] = [];
    Object.values({
      ...characterAssetDocuments,
      ...campaignAssetDocuments,
    }).forEach((assetDocument) => {
      const asset = getAsset(assetDocument.id, tree);
      if (!asset) return;

      asset.abilities.forEach((ability, index) => {
        if (ability.enabled || assetDocument.enabledAbilities[index]) {
          ability.enhance_moves?.forEach((moveEnhancement) => {
            moveEnhancements.push({
              assetId: assetDocument.id,
              assetName: asset.name,
              enhancement: moveEnhancement,
            });
          });
        }
      });
    });
    return moveEnhancements;
  }, [characterAssetDocuments, campaignAssetDocuments, tree]);

  const moveEnhancements = useMemo(() => {
    return activeAssetMoveEnhancements.filter(({ enhancement }) => {
      return (
        !enhancement.enhances ||
        enhancement.enhances?.some((wildcardId) => {
          const matches = IdParser.getMatches(wildcardId as Primary, tree);
          return matches.has(moveId);
        })
      );
    });
  }, [activeAssetMoveEnhancements, moveId, tree]);

  return moveEnhancements;
}
