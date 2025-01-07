import { useGamePermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { useUID } from "stores/auth.store";
import { GamePermission } from "stores/game.store";
import { useNotesStore } from "stores/notes.store";

import { EditPermissions } from "repositories/shared.types";

export interface FolderPermissions {
  canChangePermissions: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function useFolderPermission(folderId: string): FolderPermissions {
  const { writePermissions, folderCreator } = useNotesStore((store) => {
    const folder = store.folderState.folders[folderId];
    if (!folder) {
      return {
        isInGuideFolder: false,
      };
    }
    const folderCreator = folder.creator;

    if (folder.editPermissions) {
      return {
        writePermissions: folder.editPermissions,
        folderCreator,
      };
    }

    return {
      folderCreator,
    };
  });

  const uid = useUID();
  const { gamePermission: campaignPermission } = useGamePermissions();

  if (!writePermissions || campaignPermission === GamePermission.Viewer) {
    return {
      canChangePermissions: false,
      canEdit: false,
      canDelete: false,
    };
  }

  const isUserGuide = campaignPermission === GamePermission.Guide;
  const isUserFolderCreator = folderCreator === uid;

  if (writePermissions === EditPermissions.AllPlayers) {
    return {
      canChangePermissions: isUserFolderCreator,
      canEdit: true,
      canDelete: true,
    };
  }

  if (writePermissions === EditPermissions.OnlyAuthor) {
    return {
      canChangePermissions: isUserFolderCreator,
      canEdit: isUserFolderCreator,
      canDelete: isUserFolderCreator,
    };
  }

  if (writePermissions === EditPermissions.GuidesAndAuthor) {
    return {
      canChangePermissions: isUserFolderCreator,
      canEdit: isUserFolderCreator || isUserGuide,
      canDelete: isUserFolderCreator,
    };
  }

  if (writePermissions === EditPermissions.OnlyGuides) {
    return {
      canChangePermissions: isUserGuide,
      canEdit: isUserGuide,
      canDelete: isUserGuide,
    };
  }

  return {
    canChangePermissions: false,
    canEdit: false,
    canDelete: false,
  };
}
