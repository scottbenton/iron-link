import { useGamePermissions } from "components/pages/games/gamePageLayout/hooks/usePermissions";

import { CharacterPermissionType } from "stores/gameCharacters.store";

export function useIsOwnerOfCharacter() {
  const characterPermission = useGamePermissions().characterPermission;
  return characterPermission === CharacterPermissionType.Owner;
}
