import { useTranslation } from "react-i18next";
import { Box, Card, LinearProgress } from "@mui/material";

import { CharacterSidebarContents } from "./components/CharacterSidebarContents";
import { ReferenceSidebarContents } from "./components/ReferenceSidebarContents";
import { useDerivedCurrentCharacterState } from "./hooks/useDerivedCharacterState";
import { useSyncCharacterColorScheme } from "./hooks/useSyncCharacterColorScheme";
import { EmptyState } from "components/Layout/EmptyState";
import { NotesSection } from "./components/NotesSection";

export function CharacterSheetPage() {
  const { hasCharacter, error } = useDerivedCurrentCharacterState((store) => ({
    hasCharacter: !!store?.characterDocument?.data,
    error: store?.characterDocument?.error,
  }));

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
