import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { D10Icon } from "assets/D10Icon";
import { D6Icon } from "assets/D6Icon";
import { RollResult, StatRoll } from "types/DieRolls.type";
import React, { useState } from "react";
import { useSnackbar } from "providers/SnackbarProvider";
import { useCharacterIdOptional } from "../../hooks/useCharacterId";
import { useDerivedCharacterState } from "../../hooks/useDerivedCharacterState";
import { getRoll } from "pages/games/hooks/useRollStatAndAddToLog";
import { updateLog } from "api-calls/game-log/updateLog";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { useMove } from "hooks/datasworn/useMove";
import { useTranslation } from "react-i18next";
import { RollSnackbar } from "components/characters/rolls/RollSnackbar";

export interface DieRerollDialogProps {
  open: boolean;
  handleClose: () => void;
  rollId: string;
  roll: StatRoll;
}

export function DieRerollDialog(props: DieRerollDialogProps) {
  const { open, handleClose, roll, rollId } = props;

  const { t } = useTranslation();
  const campaignId = useCampaignId();
  const characterId = useCharacterIdOptional();
  const momentum = useDerivedCharacterState(
    characterId,
    (state) => state?.characterDocument.data?.momentum ?? 0
  );

  const { info } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [action, setAction] = useState(roll.action);
  const [challenge1, setChallenge1] = useState(roll.challenge1);
  const [challenge2, setChallenge2] = useState(roll.challenge2);

  const matchedNegativeMomentum = momentum < 0 && Math.abs(momentum) === action;
  const actionTotal = Math.min(
    10,
    (matchedNegativeMomentum ? 0 : action) +
      (roll.modifier ?? 0) +
      (roll.adds ?? 0)
  );

  let result: RollResult = RollResult.WeakHit;
  if (actionTotal > challenge1 && actionTotal > challenge2) {
    result = RollResult.StrongHit;
    // Strong Hit
  } else if (actionTotal <= challenge1 && actionTotal <= challenge2) {
    result = RollResult.Miss;
  }
  const updatedRoll: StatRoll = {
    ...roll,
    action,
    challenge1,
    challenge2,
    result,
    matchedNegativeMomentum,
  };

  const handleRoll = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    dieSides: number,
    dieLabel: string
  ) => {
    const roll = getRoll(dieSides);
    setter(roll);
    info(`Rerolled ${dieLabel} die for a new value of ${roll}`);
  };

  const handleSave = () => {
    setLoading(true);
    updateLog({ campaignId, logId: rollId, log: updatedRoll })
      .then(() => {
        setLoading(false);
        handleClose();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const move = useMove(roll.moveId ?? "");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onClick={(evt) => evt.stopPropagation()}
    >
      <DialogTitleWithCloseButton onClose={handleClose}>
        {t("game.log.reroll-dialog.title", "Reroll {{label}}", {
          label: move ? move.name : roll.rollLabel,
        })}
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Stack
          spacing={1}
          sx={{
            "&>div": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 1,
              bgcolor: "background.paperInlay",
              px: 1,
              py: 1,
              "&>div": {
                display: "flex",
                alignItems: "center",
                "& svg": {
                  color: "text.secondary",
                },
              },
            },
          }}
        >
          <Box>
            <Box>
              <D6Icon />
              <Typography variant={"h6"} component={"span"} ml={1}>
                {action}
              </Typography>
            </Box>
            <Button
              color="inherit"
              onClick={() => handleRoll(setAction, 6, "action")}
            >
              {t("game.log.reroll-dialog.reroll", "Reroll")}
            </Button>
          </Box>
          <Box>
            <Box>
              <D10Icon />
              <Typography variant={"h6"} component={"span"} ml={1}>
                {challenge1}
              </Typography>
            </Box>
            <Button
              color="inherit"
              onClick={() => handleRoll(setChallenge1, 10, "challenge")}
            >
              {t("game.log.reroll-dialog.reroll", "Reroll")}
            </Button>
          </Box>
          <Box>
            <Box>
              <D10Icon />
              <Typography variant={"h6"} component={"span"} ml={1}>
                {challenge2}
              </Typography>
            </Box>
            <Button
              color="inherit"
              onClick={() => handleRoll(setChallenge2, 10, "challenge")}
            >
              {t("game.log.reroll-dialog.reroll", "Reroll")}
            </Button>
          </Box>
        </Stack>
        <Box mt={4}>
          <Typography variant={"h6"} component={"p"}>
            Result
          </Typography>
          <RollSnackbar rollId={rollId} roll={updatedRoll} isExpanded />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color={"inherit"} onClick={handleClose} disabled={loading}>
          {t("common.cancel", "Cancel")}
        </Button>
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={handleSave}
          disabled={loading}
        >
          {t("game.log.reroll-dialog-save", "Save Roll")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
