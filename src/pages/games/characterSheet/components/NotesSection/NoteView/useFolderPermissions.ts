import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";
import { NoteFolder, WritePermissions } from "api-calls/notes/_notes.type";
import { useUID } from "atoms/auth.atom";
import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

export interface FolderPermissions {
  canEdit: boolean;
  canDelete: boolean;
}

export function useFolderPermission(folderId: string): FolderPermissions {
  const { writePermissions, folderCreator, isFolderInGuideFolder } =
    useDerivedNotesAtom((state) => {
      const folder = state.folders.folders[folderId];
      if (!folder) {
        return {};
      }
      const folderCreator = folder.creator;

      let isFolderInGuideFolder = false;
      let folderIdToCheck: string | null = folderId;
      while (folderIdToCheck) {
        if (folderIdToCheck === GUIDE_NOTE_FOLDER_NAME) {
          isFolderInGuideFolder = true;
          break;
        }
        const currentFolder: NoteFolder =
          state.folders.folders[folderIdToCheck];
        folderIdToCheck = currentFolder?.parentFolderId;
      }

      if (folder.writePermissions) {
        return {
          writePermissions: folder.writePermissions,
          folderCreator,
          isFolderInGuideFolder,
        };
      }

      return {
        folderCreator,
        isFolderInGuideFolder,
      };
    });

  const uid = useUID();
  const { campaignPermission } = useCampaignPermissions();

  if (
    !writePermissions ||
    campaignPermission === CampaignPermissionType.Viewer
  ) {
    return {
      canEdit: false,
      canDelete: false,
    };
  }

  const isUserGuide = campaignPermission === CampaignPermissionType.Guide;
  const isUserFolderCreator = folderCreator === uid;
  const canDelete = isFolderInGuideFolder ? isUserGuide : isUserFolderCreator;

  if (writePermissions.type === WritePermissions.AllPlayers) {
    return {
      canEdit: true,
      canDelete,
    };
  }

  if (writePermissions.type === WritePermissions.OnlyAuthor) {
    return {
      canEdit: isUserFolderCreator,
      canDelete,
    };
  }

  if (writePermissions.type === WritePermissions.GuidesAndPlayerSubset) {
    const isGuideOrInPlayerSubset =
      isUserGuide || writePermissions.players?.includes(uid) || false;

    return {
      canEdit: isGuideOrInPlayerSubset,
      canDelete,
    };
  }

  if (writePermissions.type === WritePermissions.OnlyGuides) {
    return {
      canEdit: isUserGuide,
      canDelete,
    };
  }

  return {
    canEdit: false,
    canDelete: false,
  };
}
