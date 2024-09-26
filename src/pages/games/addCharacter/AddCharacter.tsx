import { useNavigate, useParams } from "react-router-dom";
import { CreateCharacter } from "../create/components/CreateCharacter";
import { Alert, Box } from "@mui/material";
import { GradientButton } from "components/GradientButton";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { useAuthAtom } from "atoms/auth.atom";
import { useCreateCharacterAtom } from "../create/atoms/createCharacter.atom";
import { createCharacterAndUploadPortrait } from "api-calls/character/createCharacter";
import { addCharacterToCampaign } from "api-calls/campaign/addCharacterToCampaign";
import { pathConfig } from "pages/pathConfig";

export function AddCharacter() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { t } = useTranslation();

  const [error, setError] = useState<string | undefined>(undefined);

  const uid = useAuthAtom()[0].uid;

  const [characterValue, , resetCharacter] = useCreateCharacterAtom();
  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    const { name, stats, assets, portrait } = characterValue;

    if (!campaignId) {
      setError(t("No campaign found"));
      return;
    }
    if (!name) {
      setError(t("Please enter a name"));
      return;
    }

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
            resetCharacter();
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

    // Create campaign & character, then link them
  }, [characterValue, uid, t, navigate, resetCharacter, campaignId]);

  if (!campaignId) {
    return null;
  }

  return (
    <>
      {error && (
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      )}
      <CreateCharacter />
      <Box mt={4} display="flex" justifyContent={"flex-end"}>
        <GradientButton onClick={handleCreate}>
          {t("Add Character")}
        </GradientButton>
      </Box>
    </>
  );
}
