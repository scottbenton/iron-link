import {
  CharacterPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

export function useIsOwnerOfCharacter() {
  const characterPermission = useCampaignPermissions().characterPermission;
  return characterPermission === CharacterPermissionType.Owner;
}
