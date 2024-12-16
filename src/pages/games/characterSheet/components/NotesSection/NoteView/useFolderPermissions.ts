import { useGamePermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { useUID } from "stores/auth.store";
import { GamePermission } from "stores/game.store";
import { GUIDE_NOTE_FOLDER_NAME, useNotesStore } from "stores/notes.store";

import { EditPermissions } from "repositories/shared.types";

import { INoteFolder } from "services/noteFolders.service";

export interface FolderPermissions {
  isInGuideFolder: boolean;
  canChangePermissions: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function useFolderPermission(folderId: string): FolderPermissions {
  const { writePermissions, folderCreator, isInGuideFolder } = useNotesStore(
    (store) => {
      const folder = store.folderState.folders[folderId];
      if (!folder) {
        return {
          isInGuideFolder: false,
        };
      }
      const folderCreator = folder.creator;

      let isInGuideFolder = false;
      let folderIdToCheck: string | null = folderId;
      while (folderIdToCheck) {
        if (folderIdToCheck === GUIDE_NOTE_FOLDER_NAME) {
          isInGuideFolder = true;
          break;
        }
        const currentFolder: INoteFolder =
          store.folderState.folders[folderIdToCheck];
        folderIdToCheck = currentFolder?.parentFolderId;
      }

      if (folder.editPermissions) {
        return {
          writePermissions: folder.editPermissions,
          folderCreator,
          isInGuideFolder: isInGuideFolder ?? false,
        };
      }

      return {
        folderCreator,
        isInGuideFolder: isInGuideFolder ?? false,
      };
    },
  );

  const uid = useUID();
  const { gamePermission: campaignPermission } = useGamePermissions();

  if (!writePermissions || campaignPermission === GamePermission.Viewer) {
    return {
      canChangePermissions: false,
      canEdit: false,
      canDelete: false,
      isInGuideFolder: isInGuideFolder,
    };
  }

  const isUserGuide = campaignPermission === GamePermission.Guide;
  const isUserFolderCreator = folderCreator === uid;
  const canChangePermissions = isInGuideFolder
    ? isUserGuide
    : isUserFolderCreator;
  const canDelete = isInGuideFolder ? isUserGuide : isUserFolderCreator;

  if (writePermissions === EditPermissions.AllPlayers) {
    return {
      canChangePermissions,
      canEdit: true,
      canDelete,
      isInGuideFolder,
    };
  }

  if (writePermissions === EditPermissions.OnlyAuthor) {
    return {
      canChangePermissions,
      canEdit: isUserFolderCreator,
      canDelete,
      isInGuideFolder,
    };
  }

  if (writePermissions === EditPermissions.GuidesAndAuthor) {
    return {
      canChangePermissions,
      canEdit: isUserFolderCreator || isUserGuide,
      canDelete,
      isInGuideFolder,
    };
  }

  if (writePermissions === EditPermissions.OnlyGuides) {
    return {
      canChangePermissions,
      canEdit: isUserGuide,
      canDelete,
      isInGuideFolder,
    };
  }

  return {
    canChangePermissions: false,
    canEdit: false,
    canDelete: false,
    isInGuideFolder,
  };
}
