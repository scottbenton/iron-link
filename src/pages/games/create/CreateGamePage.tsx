import { PageContent, PageHeader } from "components/Layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChooseGameType } from "./components/ChooseGameType";
import {
  createGameAtom,
  defaultState,
  ICreateGameAtom,
  useSetCreateGameAtom,
} from "./atoms/createGame.atom";
import { Alert, Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { CampaignType } from "api-calls/campaign/_campaign.type";
import { useAtomValue } from "jotai";
import { GradientButton } from "components/GradientButton";
import { RulesetExpansionSection } from "./components/RulesetExpansionSection";
import { CreateCharacter } from "./components/CreateCharacter";
import { useSyncActiveRulesPackages } from "./hooks/useSyncActiveRulesPackages";
import { useCreateCharacterAtom } from "./atoms/createCharacter.atom";
import { createCampaign } from "api-calls/campaign/createCampaign";
import { useAuthAtom } from "atoms/auth.atom";
import { createCharacterAndUploadPortrait } from "api-calls/character/createCharacter";
import { addCharacterToCampaign } from "api-calls/campaign/addCharacterToCampaign";
import { useNavigate } from "react-router-dom";
import { pathConfig } from "pages/pathConfig";
import { GameDetails } from "./components/GameDetails";
import { TFunction } from "i18next";
import { addAsset } from "api-calls/assets/addAsset";

interface StepConfig {
  label: string;
  component: JSX.Element;
  actionLabel?: string;
  getErrorIfExists?: (state: ICreateGameAtom) => string | undefined;
}

const chooseGameTypeStep = (t: TFunction): StepConfig => ({
  label: t("game.create.choose-game-type-step", "Choose Game Type"),
  component: <ChooseGameType />,
});
const chooseRulesetStep = (t: TFunction): StepConfig => ({
  label: t("game.create.choose-rulesets-step", "Choose Rulesets"),
  component: <RulesetExpansionSection />,
  getErrorIfExists: (state) => {
    if (
      Object.values(state.rulesets).filter((isActive) => isActive).length === 0
    ) {
      return t(
        "game.create.rulesets-required-error",
        "Please select at least one ruleset"
      );
    }
  },
});
const createCharacterStep = (t: TFunction): StepConfig => ({
  label: t("game.create.create-character-step", "Create Character"),
  component: <CreateCharacter />,
  actionLabel: t("game.create.create-character-submit", "Create Character"),
});

const gameSettingsStep = (t: TFunction): StepConfig => ({
  label: t("game.create.game-details-step", "Game Details"),
  component: <GameDetails />,
  actionLabel: t("game.create.create-game-submit", "Create Game"),
});

const derivedSteps = (t: TFunction) =>
  derivedAtomWithEquality<ICreateGameAtom, StepConfig[]>(
    createGameAtom,
    (atom) => {
      const { gameType } = atom;
      if (gameType === CampaignType.Solo) {
        return [
          chooseGameTypeStep(t),
          chooseRulesetStep(t),
          createCharacterStep(t),
        ];
      } else if (gameType === CampaignType.Coop) {
        return [
          chooseGameTypeStep(t),
          chooseRulesetStep(t),
          gameSettingsStep(t),
        ];
      } else {
        return [
          chooseGameTypeStep(t),
          chooseRulesetStep(t),
          gameSettingsStep(t),
        ];
      }
    }
  );

export function CreateGamePage() {
  const { t } = useTranslation();

  const uid = useAuthAtom()[0].uid;

  const createGameValue = useAtomValue(createGameAtom);
  const setCreateGameAtom = useSetCreateGameAtom();
  const [characterValue, , resetCharacter] = useCreateCharacterAtom();
  useEffect(() => {
    return () => {
      setCreateGameAtom(defaultState);
      resetCharacter();
    };
  }, [setCreateGameAtom, resetCharacter]);

  const steps = useAtomValue(useMemo(() => derivedSteps(t), [t]));
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | undefined>();

  const handleNextClick = useCallback(() => {
    const errorMessage = steps[step]?.getErrorIfExists?.(createGameValue);
    setError(errorMessage);
    if (!errorMessage) {
      setStep((step) => step + 1);
    }
  }, [createGameValue, step, steps]);

  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    const { gameType, gameName, rulesets, expansions } = createGameValue;
    const { name, stats, characterAssets, gameAssets, portrait } =
      characterValue;

    const campaignName = gameType === CampaignType.Solo ? name : gameName;
    if (!campaignName) {
      setError(t("game.create.error-no-name", "Please enter a name"));
      return;
    }

    // Create campaign
    createCampaign({
      uid,
      campaignName,
      campaignType: gameType,
      rulesets,
      expansions,
    })
      .then((campaignId) => {
        if (createGameValue.gameType === CampaignType.Solo) {
          const characterPromise = createCharacterAndUploadPortrait(
            uid,
            name,
            stats,
            characterAssets,
            portrait,
            campaignId
          );

          const gameAssetPromises = gameAssets.map((asset) => {
            return addAsset({
              asset,
              campaignId,
            });
          });
          Promise.all(gameAssetPromises).catch(() => {
            console.error("Failed to link game assets to campaign");
          });
          characterPromise
            .then((characterId) => {
              addCharacterToCampaign({ uid, campaignId, characterId })
                .then(() => {
                  // Redirect to game page
                  navigate(pathConfig.gameCharacter(campaignId, characterId));
                })
                .catch((e) => {
                  console.error(e);
                  setError(
                    t(
                      "game.create.error-adding-character-to-game",
                      "Error adding character to game"
                    )
                  );
                });
            })
            .catch((e) => {
              console.error(e);
              setError(
                t(
                  "game.create.error-creating-character",
                  "Error creating character"
                )
              );
            });
        } else {
          // Redirect to game page
          navigate(pathConfig.game(campaignId));
        }
      })
      .catch((e) => {
        console.error(e);
        setError(t("game.create.error-creating-game", "Error creating game"));
      });
    // Create campaign & character, then link them
  }, [characterValue, createGameValue, uid, t, navigate]);

  useSyncActiveRulesPackages(
    createGameValue.rulesets,
    createGameValue.expansions
  );

  return (
    <>
      <PageHeader label={t("game.create.new-game", "New Game")} maxWidth="md" />
      <PageContent maxWidth="md">
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((stepConfig) => (
            <Step key={stepConfig.label}>
              <StepLabel>{stepConfig.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {steps[step]?.component}
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
      </PageContent>
    </>
  );
}
