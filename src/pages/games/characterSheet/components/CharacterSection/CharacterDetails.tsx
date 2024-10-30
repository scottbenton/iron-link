import { Box, Typography } from "@mui/material";

import { useCharacterId } from "../../hooks/useCharacterId";
import { useDerivedCurrentCharacterState } from "../../hooks/useDerivedCharacterState";
import { InitiativeStatus } from "api-calls/character/_character.type";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { PortraitAvatar } from "components/characters/PortraitAvatar";
import { InitiativeStatusChip } from "components/datasworn/InitiativeStatusChip";
import {
  CharacterPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

export function CharacterDetails() {
  const characterId = useCharacterId();
  const isCharacterOwner =
    useCampaignPermissions().characterPermission ===
    CharacterPermissionType.Owner;

  const { name, initiativeStatus, portraitSettings } =
    useDerivedCurrentCharacterState((character) => ({
      name: character?.characterDocument.data?.name ?? "",
      initiativeStatus: character?.characterDocument.data?.initiativeStatus,
      portraitSettings: character?.characterDocument.data?.profileImage,
    }));

  return (
    <Box display="flex" gap={2}>
      {portraitSettings && (
        <PortraitAvatar
          characterId={characterId ?? ""}
          name={name}
          size={"large"}
          portraitSettings={portraitSettings ?? undefined}
        />
      )}
      <Box>
        <Typography variant="h4" fontFamily={"fontFamilyTitle"}>
          {name}
        </Typography>
        <InitiativeStatusChip
          status={initiativeStatus ?? InitiativeStatus.OutOfCombat}
          handleStatusChange={
            isCharacterOwner
              ? (status) => {
                  if (characterId) {
                    updateCharacter({
                      characterId,
                      character: { initiativeStatus: status },
                    }).catch(() => {});
                  }
                }
              : undefined
          }
        />
      </Box>
    </Box>
  );
}
