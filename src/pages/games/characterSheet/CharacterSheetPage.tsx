import { Box, Card, LinearProgress } from "@mui/material";
import { useCharacterState } from "./hooks/useCharacterState";
import { EmptyState } from "components/Layout/EmptyState";
import { useTranslation } from "react-i18next";
import { CharacterSidebarContents } from "./components/CharacterSidebarContents";
import { useSyncCharacterColorScheme } from "./hooks/useSyncCharacterColorScheme";
import { ReferenceSidebarContents } from "./components/ReferenceSidebarContents";

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
          "Error loading character"
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
          p: 2,
          overflow: "auto",
        }}
      >
        <ReferenceSidebarContents />
      </Card>
    </Box>
  );
}
