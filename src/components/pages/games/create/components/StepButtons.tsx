import { Box, Button } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { GradientButton } from "components/GradientButton";

import { useUID } from "stores/auth.store";
import { useCreateCharacterStore } from "stores/createCharacter.store";
import { useCreateGameStore } from "stores/createGame.store";

import { usePathConfig } from "lib/paths.lib";

import { GameType } from "repositories/game.repository";

import { StepConfig } from "../steps";

export interface StepButtonsProps {
  step: number;
  setError: (error: string | undefined) => void;
  setStep: Dispatch<SetStateAction<number>>;
  steps: StepConfig[];
}

export function StepButtons(props: StepButtonsProps) {
  const { step, setError, setStep, steps } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const pathConfig = usePathConfig();
  const uid = useUID();

  const createGame = useCreateGameStore((store) => store.createGame);
  const createCharacter = useCreateCharacterStore(
    (store) => store.createCharacter,
  );

  const handleCreate = useCallback(() => {
    const { gameName, gameType } = useCreateGameStore.getState();

    const { characterName } = useCreateCharacterStore.getState();

    const finalGameName = gameType === GameType.Solo ? characterName : gameName;
    if (!finalGameName) {
      setError(t("game.create.error-no-name", "Please enter a name"));
      return;
    }

    if (!uid) {
      return;
    }

    createGame(uid, finalGameName)
      .then((gameId) => {
        if (gameType === GameType.Solo) {
          createCharacter(gameId, uid)
            .then((characterId) => {
              navigate({
                from: pathConfig.gameCreate,
                to: pathConfig.gameCharacter,
                params: {
                  gameId,
                  characterId,
                },
              });
            })
            .catch(() => {
              setError(
                t(
                  "game.create.error-creating-character",
                  "Error creating character",
                ),
              );
            });
        } else {
          navigate({
            from: pathConfig.gameCreate,
            to: pathConfig.game,
            params: {
              gameId,
            },
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setError(t("game.create.error-creating-game", "Error creating game"));
      });
  }, [t, navigate, uid, setError, createGame, createCharacter]);

  const handleNextClick = useCallback(() => {
    setStep((step) => step + 1);
  }, [setStep]);

  return (
    <Box mt={4} display="flex" justifyContent="space-between">
      <Button
        color="inherit"
        variant="outlined"
        disabled={step <= 0}
        onClick={() => {
          setError(undefined);
          setStep((step) => step - 1);
        }}
      >
        {t("common.back", "Back")}
      </Button>
      {step === steps.length - 1 ? (
        <GradientButton onClick={() => handleCreate()}>
          {steps[step]?.actionLabel ??
            t("game.create.start-game", "Start Game")}
        </GradientButton>
      ) : (
        <Button
          variant="contained"
          disabled={step >= steps.length}
          onClick={handleNextClick}
        >
          {t("common.next", "Next")}
        </Button>
      )}
    </Box>
  );
}
