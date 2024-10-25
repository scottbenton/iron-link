import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Datasworn } from "@datasworn/core";
import { TFunction } from "i18next";

import { addRoll } from "api-calls/game-log/addRoll";
import { useSetAnnouncement } from "atoms/announcement.atom";
import { useAuthAtom } from "atoms/auth.atom";
import { useDataswornTree } from "atoms/dataswornTree.atom";
import { useAddRollSnackbar } from "atoms/rollDisplay.atom";
import { getMove } from "hooks/datasworn/useMove";
import { createId } from "lib/id.lib";
import { RollResult, RollType, StatRoll } from "types/DieRolls.type";

interface StatRollConfig {
  statId: string;
  statLabel: string;
  statModifier: number;
  moveId?: string;
  adds?: number;
  momentum: number;
  hideSnackbar?: boolean;
  characterId?: string;
}

export function useRollStatAndAddToLog() {
  const uid = useAuthAtom()[0].uid;
  const { characterId, campaignId } = useParams<{
    characterId?: string;
    campaignId?: string;
  }>();
  const dataswornTree = useDataswornTree();

  const { t } = useTranslation();

  const announce = useSetAnnouncement();
  const addRollSnackbar = useAddRollSnackbar();

  const rollStat = useCallback(
    (config: StatRollConfig) => {
      const result = getStatRollResult(
        config,
        uid,
        config.characterId ?? characterId,
      );

      const rollId = uploadRoll(result, campaignId);

      announceRoll(result, config, dataswornTree, t, announce);

      if (!config.hideSnackbar) {
        addRollSnackbar(rollId, result);
      }

      return result;
    },
    [dataswornTree, uid, characterId, campaignId, t, announce, addRollSnackbar],
  );

  return rollStat;
}

export const getRoll = (dieMax: number) => {
  return Math.floor(Math.random() * dieMax) + 1;
};

function getStatRollResult(
  config: StatRollConfig,
  uid: string,
  characterId?: string,
): StatRoll {
  const { momentum, statModifier, adds, statLabel, moveId, statId } = config;

  const challenge1 = getRoll(10);
  const challenge2 = getRoll(10);
  const action = getRoll(6);

  const matchedNegativeMomentum = momentum < 0 && Math.abs(momentum) === action;
  const actionTotal = Math.min(
    10,
    (matchedNegativeMomentum ? 0 : action) + statModifier + (adds ?? 0),
  );

  let result: RollResult = RollResult.WeakHit;
  if (actionTotal > challenge1 && actionTotal > challenge2) {
    result = RollResult.StrongHit;
  } else if (actionTotal <= challenge1 && actionTotal <= challenge2) {
    result = RollResult.Miss;
  }

  const roll: StatRoll = {
    type: RollType.Stat,
    rollLabel: statLabel,
    timestamp: new Date(),
    characterId: characterId || null,
    uid: uid,
    matchedNegativeMomentum,
    gmsOnly: false,
    moveId: moveId ?? null,
    rolled: statId,
    action,
    actionTotal,
    challenge1,
    challenge2,
    result,
    modifier: statModifier,
    adds: adds ?? 0,
    momentumBurned: null,
  };

  return roll;
}

function uploadRoll(roll: StatRoll, campaignId?: string) {
  const rollId = createId();
  if (campaignId) {
    addRoll({
      campaignId,
      rollId,
      roll,
    }).catch(() => {});
  }
  return rollId;
}

function announceRoll(
  roll: StatRoll,
  rollConfig: StatRollConfig,
  dataswornTree: Record<string, Datasworn.RulesPackage>,
  t: TFunction,
  announce: (announcement: string) => void,
) {
  let move: Datasworn.Move | undefined = undefined;

  if (roll.moveId) {
    move = getMove(roll.moveId, dataswornTree);
  }

  let announcement: string;

  if (move) {
    announcement = t(
      "datasworn.a11y.action-roll-with-move",
      "Rolled {{moveName}} using stat {{statLabel}}.",
      {
        moveName: move.name,
        statLabel: roll.rollLabel,
      },
    );
  } else {
    announcement = t(
      "datasworn.a11y.action-roll-no-move",
      "Rolled plus {{statLabel}}.",
      {
        statLabel: roll.rollLabel,
      },
    );
  }

  if (roll.matchedNegativeMomentum) {
    announcement += t(
      "datasworn.a11y.action-roll-total-matched-negative-momentum",
      " On your action die you rolled a {{action}} which matched your momentum of {{momentum}}, so your action die got cancelled out. Your modifiers are {{statModifier}} plus {{adds}} for a total of {{actionTotal}}.",
      {
        action: roll.actionTotal === 10 ? t("max of 10") : roll.actionTotal,
        momentum: rollConfig.momentum,
        statModifier: rollConfig.statModifier,
        adds: roll.adds,
        actionTotal: roll.actionTotal,
      },
    );
  } else {
    announcement += t(
      "datasworn.a11y.action-roll-total",
      " On your action die you rolled a {{action}} plus {{statModifier}} plus {{adds}} for a total of {{actionTotal}}.",
      {
        action: roll.actionTotal === 10 ? t("max of 10") : roll.actionTotal,
        statModifier: rollConfig.statModifier,
        adds: roll.adds,
        actionTotal: roll.actionTotal,
      },
    );
  }
  const resultLabel = t("datasworn.weak-hit", "Weak Hit");
  if (roll.result === RollResult.StrongHit) {
    t("datasworn.strong-hit", "Strong Hit");
  } else if (roll.result === RollResult.Miss) {
    t("datasworn.miss", "Miss");
  }
  announcement += t(
    "datasworn.a11y.action-roll-result",
    " On your challenge die you rolled a {{challenge1}} and a {{challenge2}}, for a {{resultLabel}}.",
    {
      challenge1: roll.challenge1,
      challenge2: roll.challenge2,
      resultLabel,
    },
  );
  // verboseScreenReaderRolls
  //             ? announcement
  //             : `Rolled ${
  //                 move ? move.name + "using stat" + label : label
  //               }. Your action die had a total of ${actionTotal} against ${challenge1} and ${challenge2}, for a ${getRollResultLabel(
  //                 result
  //               )}`
  //         );
  announce(announcement);
}
