import { Box } from "@mui/material";
import { CharacterDetails } from "./CharacterDetails";
import { Stats } from "./Stats";
import { ConditionMeters } from "./ConditionMeters";
import { ImpactsSection } from "./ImpactsSection";
import { LegacyTracks } from "./LegacyTracks";
import { ExperienceSection } from "./ExperienceSection";

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
