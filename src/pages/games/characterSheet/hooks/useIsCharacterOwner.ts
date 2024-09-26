import {
  CharacterPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

export function useIsCharacterOwner() {
  const characterPermission = useCampaignPermissions().characterPermission;
  return characterPermission === CharacterPermissionType.Owner;
}
