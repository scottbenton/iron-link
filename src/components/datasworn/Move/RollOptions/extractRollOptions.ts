import { Datasworn, IdParser } from "@datasworn/core";
import {
  CampaignRollOptionState,
  CharacterRollOptionState,
} from "./common.types";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { getAsset } from "hooks/datasworn/useAsset";
import { Primary } from "@datasworn/core/dist/StringId";
import { TrackTypes } from "types/Track.type";

interface RollOptionGroup {
  actionRolls: Datasworn.RollableValue[];
  specialTracks: string[] | undefined;
  assetEnhancements: AssetEnhancements;
}

export function extractRollOptions(
  move: Datasworn.Move,
  campaignRollOptionState: CampaignRollOptionState,
  characterRollOptionStates: Record<string, CharacterRollOptionState>,
  tree: Record<string, Datasworn.RulesPackage>
): {
  sharedEnhancements: AssetEnhancements;
  visibleProgressTrack: TrackTypes | undefined;
  character: Record<string, RollOptionGroup>;
} {
  const validSharedActionRolls = extractValidActionRollOptions(
    move,
    campaignRollOptionState.assets,
    undefined,
    tree
  );
  const sharedAssetEnhancements = getEnhancementsFromAssets(
    move._id,
    campaignRollOptionState.assets,
    tree
  );
  const specialTrackConditions = getSpecialTrackConditions(move);

  const characterOptions: Record<string, RollOptionGroup> = {};
  Object.entries(characterRollOptionStates).forEach(
    ([characterId, character]) => {
      const validActionRolls = extractValidActionRollOptions(
        move,
        character.assets,
        character,
        tree
      );

      const enhancements = getEnhancementsFromAssets(
        move._id,
        character.assets,
        tree
      );

      Object.values(sharedAssetEnhancements).forEach((assetEnhancement) => {
        validActionRolls.push(...assetEnhancement.actionRolls);
      });

      if (
        validActionRolls.length > 0 ||
        validSharedActionRolls.length > 0 ||
        Object.keys(enhancements).length > 0 ||
        specialTrackConditions.length > 0
      ) {
        characterOptions[characterId] = {
          actionRolls: [...validActionRolls, ...validSharedActionRolls],
          assetEnhancements: enhancements,
          specialTracks: specialTrackConditions,
        };
      }
    }
  );

  return {
    visibleProgressTrack: getVisibleProgressTrack(move),
    sharedEnhancements: sharedAssetEnhancements,
    character: characterOptions,
  };
}

export type AssetEnhancements = Record<
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
  tree: Record<string, Datasworn.RulesPackage>
): AssetEnhancements {
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
              moveEnhancement.enhances?.some((wildcardId) => {
                const matches = IdParser.getMatches(
                  wildcardId as Primary,
                  tree
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
                moveEnhancement
              );
            }
          }
        });
      }
    });
  });

  return Object.fromEntries(
    Object.entries(activeAssetMoveEnhancements).map(([abilityId, value]) => {
      const actionRolls = extractActionRollOptionsFromEnhancement(
        value.enhancements
      );

      return [
        abilityId,
        {
          ...value,
          actionRolls,
        },
      ];
    })
  );
}

// function extractSpecialTrackRollOptionsFromEnhancement(
//   enhancements: (
//     | Datasworn.MoveActionRollEnhancement
//     | Datasworn.MoveProgressRollEnhancement
//     | Datasworn.MoveSpecialTrackEnhancement
//   )[]
// ): Datasworn.TriggerSpecialTrackConditionEnhancement[] {
//   const conditions: Datasworn.TriggerSpecialTrackConditionEnhancement[] = [];
//   enhancements.forEach((enhancement) => {
//     if (
//       enhancement.roll_type === "special_track" &&
//       enhancement.trigger?.conditions
//     ) {
//       conditions.push(...enhancement.trigger.conditions);
//     }
//   });
//   return conditions;
// }

function extractActionRollOptionsFromEnhancement(
  enhancements: (
    | Datasworn.MoveActionRollEnhancement
    | Datasworn.MoveProgressRollEnhancement
    | Datasworn.MoveSpecialTrackEnhancement
  )[]
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
    Object.values(conditions)
  );
}

function extractValidActionRollOptions(
  move: Datasworn.Move,
  assets: Record<string, AssetDocument>,
  character: CharacterRollOptionState | undefined,
  tree: Record<string, Datasworn.RulesPackage>
): Datasworn.RollableValue[] {
  if (move.roll_type !== "action_roll") return [];

  const conditions = move.trigger.conditions;
  const conditionMap: Record<
    string,
    Record<string, Datasworn.RollableValue>
  > = {
    stats: {},
    conditionMeters: {},
    custom: {},
    assetControls: {},
  };

  conditions.forEach((condition) => {
    condition.roll_options.forEach((option) => {
      if (option.using === "stat" && character) {
        conditionMap.stats[option.stat] = option;
      } else if (option.using === "condition_meter" && character) {
        conditionMap.conditionMeters[option.condition_meter] = option;
      } else if (option.using === "custom" && !character) {
        conditionMap.custom[option.label] = option;
      } else if (
        option.using === "asset_control" &&
        canUseAssetControlRoll(option, assets, tree)
      ) {
        conditionMap.assetControls[option.control] = option;
      }
    });
  });

  return Object.values(conditionMap).flatMap((conditions) =>
    Object.values(conditions)
  );
}

function canUseAssetControlRoll(
  option: Datasworn.AssetControlValueRef,
  assets: Record<string, AssetDocument>,
  tree: Record<string, Datasworn.RulesPackage>
): boolean {
  return (
    option.assets?.some((assetWildcard) => {
      const matches = IdParser.getMatches(assetWildcard as Primary, tree);
      for (const [, asset] of matches) {
        if (asset.type === "asset") {
          for (const assetDocument of Object.values(assets)) {
            if (assetDocument.id === asset._id) {
              const control = asset.controls?.[option.control];
              if (control) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }) ?? false
  );
}

function getVisibleProgressTrack(move: Datasworn.Move): TrackTypes | undefined {
  if (move.roll_type === "progress_roll") {
    switch (move.tracks.category) {
      case "Vow":
        return TrackTypes.Vow;
      case "Journey":
      case "Expedition":
        return TrackTypes.Journey;
      case "Combat":
        return TrackTypes.Fray;
      case "Scene Challenge":
        return TrackTypes.SceneChallenge;
      case "Connection":
        return TrackTypes.BondProgress;
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
}

function getSpecialTrackConditions(move: Datasworn.Move): string[] {
  if (move.roll_type === "special_track") {
    const specialTracks = new Set<string>();
    move.trigger.conditions.forEach((condition) => {
      condition.roll_options.forEach((option) => {
        specialTracks.add(option.using);
      });
    });

    return Array.from(specialTracks);
  }
  return [];
}
