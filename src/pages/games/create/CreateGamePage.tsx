import { PageContent, PageHeader } from "components/Layout";
import { useCallback, useEffect, useState } from "react";
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

interface StepConfig {
  label: string;
  component: JSX.Element;
  actionLabel?: string;
  getErrorIfExists?: (state: ICreateGameAtom) => string | undefined;
}

const chooseGameTypeStep: StepConfig = {
  label: "Choose Game Type",
  component: <ChooseGameType />,
};
const chooseRulesetStep: StepConfig = {
  label: "Choose Rulesets",
  component: <RulesetExpansionSection />,
  getErrorIfExists: (state) => {
    if (
      Object.values(state.rulesets).filter((isActive) => isActive).length === 0
    ) {
      return "Please select at least one ruleset";
    }
  },
};
const createCharacterStep: StepConfig = {
  label: "Create Character",
  component: <CreateCharacter />,
  actionLabel: "Create Character",
};
const gameSettingsStep: StepConfig = {
  label: "Game Details",
  component: <GameDetails />,
  actionLabel: "Create Game",
};

const derivedSteps = derivedAtomWithEquality<ICreateGameAtom, StepConfig[]>(
  createGameAtom,
  (atom) => {
    const { gameType } = atom;
    if (gameType === CampaignType.Solo) {
      return [chooseGameTypeStep, chooseRulesetStep, createCharacterStep];
    } else if (gameType === CampaignType.Coop) {
      return [chooseGameTypeStep, chooseRulesetStep, gameSettingsStep];
    } else {
      return [chooseGameTypeStep, chooseRulesetStep, gameSettingsStep];
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

  const steps = useAtomValue(derivedSteps);
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
    const { name, stats, assets, portrait } = characterValue;

    const campaignName = gameType === CampaignType.Solo ? name : gameName;
    if (!campaignName) {
      setError(t("Please enter a name"));
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
          createCharacterAndUploadPortrait(
            uid,
            name,
            stats,
            assets,
            portrait,
            campaignId
          )
            .then((characterId) => {
              addCharacterToCampaign({ uid, campaignId, characterId })
                .then(() => {
                  // Redirect to game page
                  navigate(pathConfig.gameCharacter(campaignId, characterId));
                })
                .catch((e) => {
                  console.error(e);
                  setError(t("Error adding character to game"));
                });
            })
            .catch((e) => {
              console.error(e);
              setError(t("Error creating character"));
            });
        } else {
          // Redirect to game page
          navigate(pathConfig.game(campaignId));
        }
      })
      .catch((e) => {
        console.error(e);
        setError(t("Error creating game"));
      });
    // Create campaign & character, then link them
  }, [characterValue, createGameValue, uid, t, navigate]);

  useSyncActiveRulesPackages(
    createGameValue.rulesets,
    createGameValue.expansions
  );

  return (
    <>
      <PageHeader label={t("New Game")} maxWidth="md" />
      <PageContent maxWidth="md">
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((stepConfig) => (
            <Step key={stepConfig.label}>
              <StepLabel>{t(stepConfig.label)}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
            {t(error)}
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
            {t("Back")}
          </Button>
          {step === steps.length - 1 ? (
            <GradientButton onClick={() => handleCreate()}>
              {t(steps[step]?.actionLabel ?? "Start Game")}
            </GradientButton>
          ) : (
            <Button
              variant="contained"
              disabled={step >= steps.length}
              onClick={handleNextClick}
            >
              {t("Next")}
            </Button>
          )}
        </Box>
      </PageContent>
    </>
  );
}
