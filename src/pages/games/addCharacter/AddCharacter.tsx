import { Alert, Box } from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { GradientButton } from "components/GradientButton";

import { pathConfig } from "pages/pathConfig";

import { useUID } from "stores/auth.store";
import { useCreateCharacterStore } from "stores/createCharacter.store";

import { CreateCharacter } from "../create/components/CreateCharacter";

export function AddCharacter() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { t } = useTranslation();

  const [error, setError] = useState<string | undefined>(undefined);

  const uid = useUID();

  const createCharacter = useCreateCharacterStore(
    (store) => store.createCharacter,
  );
  const resetCharacter = useCreateCharacterStore((store) => store.reset);
  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    if (!uid) return;

    if (!campaignId) {
      setError(t("character.no-game-found-error", "No game found"));
      return;
    }

    createCharacter(campaignId)
      .then((characterId) => {
        resetCharacter();
        navigate(pathConfig.gameCharacter(campaignId, characterId));
      })
      .catch(() => {
        setError(
          t("character.error-creating-character", "Error creating character"),
        );
      });
  }, [uid, t, navigate, campaignId, createCharacter, resetCharacter]);

  if (!campaignId || !uid) {
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
