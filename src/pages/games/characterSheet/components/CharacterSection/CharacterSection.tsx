import { Box } from "@mui/material";

import { CharacterDetails } from "pages/games/characterSheet/components/CharacterSection/CharacterDetails";
import { ConditionMeters } from "pages/games/characterSheet/components/CharacterSection/ConditionMeters";
import { ExperienceSection } from "pages/games/characterSheet/components/CharacterSection/ExperienceSection";
import { ImpactsSection } from "pages/games/characterSheet/components/CharacterSection/ImpactsSection";
import { LegacyTracks } from "pages/games/characterSheet/components/CharacterSection/LegacyTracks";
import { Stats } from "pages/games/characterSheet/components/CharacterSection/Stats";

export function CharacterSection() {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <CharacterDetails />
      <Stats />
      <ConditionMeters />
      <ImpactsSection />
      <LegacyTracks />
      <ExperienceSection />
    </Box>
  );
}
