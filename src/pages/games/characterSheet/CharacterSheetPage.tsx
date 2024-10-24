import { useTranslation } from "react-i18next";
import { Box, Card, LinearProgress } from "@mui/material";

import { EmptyState } from "components/Layout/EmptyState";
import { CharacterSidebarContents } from "pages/games/characterSheet/components/CharacterSidebarContents";
import { ReferenceSidebarContents } from "pages/games/characterSheet/components/ReferenceSidebarContents";
import { useCharacterState } from "pages/games/characterSheet/hooks/useCharacterState";
import { useSyncCharacterColorScheme } from "pages/games/characterSheet/hooks/useSyncCharacterColorScheme";

export function CharacterSheetPage() {
  const { error, hasCharacter } = useCharacterState();

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
          width: 350,
          p: 2,
          overflow: "auto",
        }}
      >
        <CharacterSidebarContents />
      </Card>
      <Box flexGrow={1}></Box>
      <Card
        variant="outlined"
        sx={{
          bgcolor: "background.default",
          width: 350,
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
