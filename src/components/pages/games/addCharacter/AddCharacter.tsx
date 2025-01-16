import { Alert, Box } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { GradientButton } from "components/GradientButton";

import { useUID } from "stores/auth.store";
import { useCreateCharacterStore } from "stores/createCharacter.store";

import { usePathConfig } from "lib/paths.lib";

import { CreateCharacter } from "../create/components/CreateCharacter";
import { useGameId } from "../gamePageLayout/hooks/useGameId";

export function AddCharacter() {
  const gameId = useGameId();
  const { t } = useTranslation();
  const pathConfig = usePathConfig();

  const [error, setError] = useState<string | undefined>(undefined);

  const uid = useUID();

  const createCharacter = useCreateCharacterStore(
    (store) => store.createCharacter,
  );
  const resetCharacter = useCreateCharacterStore((store) => store.reset);
  const navigate = useNavigate();

  const handleCreate = useCallback(() => {
    if (!uid) return;

    createCharacter(gameId, uid)
      .then((characterId) => {
        resetCharacter();
        navigate({
          from: pathConfig.gameCharacterCreate,
          to: pathConfig.gameCharacter,
          params: { gameId, characterId },
        });
      })
      .catch(() => {
        setError(
          t("character.error-creating-character", "Error creating character"),
        );
      });
  }, [uid, t, navigate, gameId, createCharacter, resetCharacter, pathConfig]);

  if (!uid) {
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
