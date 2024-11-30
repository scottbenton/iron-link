import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";
import { EditPermissions, NoteFolder } from "api-calls/notes/_notes.type";

import { useUID } from "atoms/auth.atom";

export interface FolderPermissions {
  isInGuideFolder: boolean;
  canChangePermissions: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function useFolderPermission(folderId: string): FolderPermissions {
  const { writePermissions, folderCreator, isInGuideFolder } =
    useDerivedNotesAtom(
      (state) => {
        const folder = state.folders.folders[folderId];
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
          const currentFolder: NoteFolder =
            state.folders.folders[folderIdToCheck];
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
      [folderId],
    );

  const uid = useUID();
  const { campaignPermission } = useCampaignPermissions();

  if (
    !writePermissions ||
    campaignPermission === CampaignPermissionType.Viewer
  ) {
    return {
      canChangePermissions: false,
      canEdit: false,
      canDelete: false,
      isInGuideFolder: isInGuideFolder,
    };
  }

  const isUserGuide = campaignPermission === CampaignPermissionType.Guide;
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
