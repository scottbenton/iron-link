import { useCampaignPermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { CharacterPermissionType } from "stores/gameCharacters.store";

export function useIsOwnerOfCharacter() {
  const characterPermission = useCampaignPermissions().characterPermission;
  return characterPermission === CharacterPermissionType.Owner;
}
