import { useTranslation } from "react-i18next";

import {
  SpecialTrackProgressRoll,
  TrackProgressRoll,
} from "types/DieRolls.type";

import { useMove } from "hooks/datasworn/useMove";

import { getRollResultLabel } from "data/rollResultLabel";

import { RollContainer, RollResult, RollTitle, RollValues } from "./common";

export interface TrackProgressRollSnackbarProps {
  rollId: string | undefined;
  roll: TrackProgressRoll | SpecialTrackProgressRoll;
  isExpanded: boolean;
}

export function TrackProgressRollSnackbar(
  props: TrackProgressRollSnackbarProps,
) {
  const { roll, isExpanded } = props;
  const { t } = useTranslation();

  const move = useMove(roll.moveId ?? "");

  const resultLabel = getRollResultLabel(roll.result);
  return (
    <>
      <RollTitle
        title={move ? move.name : roll.rollLabel}
        overline={move ? roll.rollLabel : undefined}
        isExpanded={isExpanded}
      />
      <RollContainer>
        <RollValues
          progress={roll.trackProgress}
          d10Results={[roll.challenge1, roll.challenge2]}
          isExpanded={isExpanded}
        />
        <RollResult
          result={resultLabel}
          extras={[
            ...(roll.challenge1 === roll.challenge2
              ? [t("datasworn.match", "Match")]
              : []),
          ]}
        />
      </RollContainer>
    </>
  );
}
