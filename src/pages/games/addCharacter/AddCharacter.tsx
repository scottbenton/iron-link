import { Alert, Box } from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { GradientButton } from "components/GradientButton";

import { pathConfig } from "pages/pathConfig";

import { addAsset } from "api-calls/assets/addAsset";
import { addCharacterToCampaign } from "api-calls/campaign/addCharacterToCampaign";
import { createCharacterAndUploadPortrait } from "api-calls/character/createCharacter";

import { useAuthAtom } from "atoms/auth.atom";

import { useCreateCharacterAtom } from "../create/atoms/createCharacter.atom";
import { CreateCharacter } from "../create/components/CreateCharacter";

export function AddCharacter() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { t } = useTranslation();

  const [error, setError] = useState<string | undefined>(undefined);

  const uid = useAuthAtom()[0].uid;

  const [characterValue, , resetCharacter] = useCreateCharacterAtom();
  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    const { name, stats, characterAssets, gameAssets, portrait } =
      characterValue;

    if (!campaignId) {
      setError(t("character.no-game-found-error", "No game found"));
      return;
    }
    if (!name) {
      setError(t("character.no-name-entered-error", "Please enter a name"));
      return;
    }

    if (campaignId) {
      Promise.all(
        gameAssets.map((asset) => {
          addAsset({
            campaignId,
            asset,
          });
        }),
      ).catch(() => {});
    }

    createCharacterAndUploadPortrait(
      uid,
      name,
      stats,
      characterAssets,
      portrait,
      campaignId,
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
            setError(
              t(
                "character.error-adding-character-to-game",
                "Error adding character to game",
              ),
            );
          });
      })
      .catch((e) => {
        console.error(e);
        setError(
          t("character.error-creating-character", "Error creating character"),
        );
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
          {t("character.add-character", "Add Character")}
        </GradientButton>
      </Box>
    </>
  );
}
