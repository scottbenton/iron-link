import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Datasworn, IdParser } from "@datasworn/core";
import { Primary } from "@datasworn/core/dist/StringId";
import { Box, Typography } from "@mui/material";

import { AssetDocument } from "api-calls/assets/_asset.type";
import { useDataswornTree } from "atoms/dataswornTree.atom";
import {
  ActionRolls,
  CampaignState,
  CharacterState,
} from "components/datasworn/Move/RollOptions";
import { MarkdownRenderer } from "components/MarkdownRenderer";
import { getAsset } from "hooks/datasworn/useAsset";

export interface AssetEnhancementsProps {
  moveId: string;
  assetDocuments: Record<string, AssetDocument>;
  character?: {
    id: string;
    data: CharacterState;
  };
  campaign: CampaignState;
}

export function AssetEnhancements(props: AssetEnhancementsProps) {
  const { moveId, assetDocuments, campaign, character } = props;
  const { t } = useTranslation();

  const tree = useDataswornTree();

  const activeAssetMoveEnhancements = useMemo(() => {
    return Object.values(
      getEnhancementsFromAssets(moveId, assetDocuments, tree),
    );
  }, [moveId, assetDocuments, tree]);

  if (activeAssetMoveEnhancements.length === 0) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      mt={activeAssetMoveEnhancements.length > 0 ? 1 : 0}
    >
      {activeAssetMoveEnhancements.map(
        (
          { assetName, assetInputName, assetAbilityText, actionRolls },
          index,
        ) => (
          <Box key={index} p={1} bgcolor="background.default" borderRadius={1}>
            <Typography textTransform="uppercase" fontFamily="fontFamilyTitle">
              {assetInputName
                ? t(
                    "datasworn.move.asset-enhancement-asset-input-name",
                    "{{assetName}} Asset: {{assetInputName}}",
                    { assetName, assetInputName },
                  )
                : t(
                    "datasworn.move.asset-enhancement-asset-name",
                    "{{assetName}} Asset",
                    { assetName },
                  )}
            </Typography>
            <MarkdownRenderer
              disableLinks
              typographyVariant="body2"
              markdown={assetAbilityText}
            />
            {actionRolls.length > 0 && (
              <ActionRolls
                actionRolls={actionRolls}
                campaignData={campaign}
                moveId={moveId}
                character={character}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        ),
      )}
    </Box>
  );
}

type ReturnType = Record<
  string,
  {
    assetName: string;
    assetInputName?: string;
    assetAbilityIndex: number;
    assetAbilityText: string;
    actionRolls: Datasworn.RollableValue[];
  }
>;

function getEnhancementsFromAssets(
  moveId: string,
  assetDocuments: Record<string, AssetDocument>,
  tree: Record<string, Datasworn.RulesPackage>,
): ReturnType {
  const activeAssetMoveEnhancements: Record<
    string,
    {
      assetName: string;
      assetInputName?: string;
      assetAbilityIndex: number;
      assetAbilityText: string;
      enhancements: (
        | Datasworn.MoveActionRollEnhancement
        | Datasworn.MoveProgressRollEnhancement
        | Datasworn.MoveSpecialTrackEnhancement
      )[];
    }
  > = {};

  Object.values(assetDocuments).forEach((assetDocument) => {
    const asset = getAsset(assetDocument.id, tree);
    if (!asset) return;

    asset.abilities.forEach((ability, index) => {
      if (ability.enabled || assetDocument.enabledAbilities[index]) {
        ability.enhance_moves?.forEach((moveEnhancement) => {
          if (moveEnhancement.roll_type !== "no_roll") {
            if (
              !moveEnhancement.enhances ||
              moveEnhancement.enhances.some((wildcardId) => {
                const matches = IdParser.getMatches(
                  wildcardId as Primary,
                  tree,
                );
                return matches.has(moveId);
              })
            ) {
              if (!activeAssetMoveEnhancements[ability._id]) {
                activeAssetMoveEnhancements[ability._id] = {
                  assetName: asset.name,
                  assetInputName:
                    assetDocument.optionValues?.["name"] ?? undefined,
                  assetAbilityIndex: index,
                  assetAbilityText: ability.text,
                  enhancements: [],
                };
              }
              activeAssetMoveEnhancements[ability._id].enhancements.push(
                moveEnhancement,
              );
            }
          }
        });
      }
    });
  });

  return Object.fromEntries(
    Object.entries(activeAssetMoveEnhancements).map(([abilityId, value]) => {
      const actionRolls = extractActionRollOptions(value.enhancements);

      return [
        abilityId,
        {
          ...value,
          actionRolls,
        },
      ];
    }),
  );
}

function extractActionRollOptions(
  enhancements: (
    | Datasworn.MoveActionRollEnhancement
    | Datasworn.MoveProgressRollEnhancement
    | Datasworn.MoveSpecialTrackEnhancement
  )[],
): Datasworn.RollableValue[] {
  const conditionMap: Record<
    string,
    Record<string, Datasworn.RollableValue>
  > = {
    stats: {},
    conditionMeters: {},
    custom: {},
    assetControls: {},
  };

  enhancements.forEach((enhancement) => {
    if (enhancement.roll_type === "action_roll") {
      enhancement.trigger?.conditions.forEach((condition) => {
        condition.roll_options?.forEach((option) => {
          if (option.using === "stat") {
            conditionMap.stats[option.stat] = option;
          } else if (option.using === "condition_meter") {
            conditionMap.conditionMeters[option.condition_meter] = option;
          } else if (option.using === "custom") {
            conditionMap.custom[option.label] = option;
          } else if (option.using === "asset_control") {
            conditionMap.assetControls[option.control] = option;
          }
        });
      });
    }
  });

  return Object.values(conditionMap).flatMap((conditions) =>
    Object.values(conditions),
  );
}
