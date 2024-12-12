import { Box, Card, LinearProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

import { EmptyState } from "components/Layout/EmptyState";

import {
  useGameCharacter,
  useGameCharactersStore,
} from "stores/gameCharacters.store";

import { CharacterSidebarContents } from "./components/CharacterSidebarContents";
import { NotesSection } from "./components/NotesSection";
import { ReferenceSidebarContents } from "./components/ReferenceSidebarContents";
import { useSyncCharacterColorScheme } from "./hooks/useSyncCharacterColorScheme";

export function CharacterSheetPage() {
  const hasCharacter = useGameCharacter((character) => !!character);
  const error = useGameCharactersStore((state) => state.error);

  const { t } = useTranslation();
  useSyncCharacterColorScheme();

  if (!hasCharacter && !error) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <EmptyState
        message={t(
          "character.error-loading-character",
          "Error loading character",
        )}
      />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        height: "100%",
        pt: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          bgcolor: "background.default",
          maxWidth: 350,
          width: "100%",
          p: 2,
          overflow: "auto",
        }}
      >
        <CharacterSidebarContents />
      </Card>
      <Box
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          px: 1,
        }}
      >
        <NotesSection />
      </Box>
      <Card
        variant="outlined"
        sx={{
          bgcolor: "background.default",
          maxWidth: 350,
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ReferenceSidebarContents />
      </Card>
    </Box>
  );
}
