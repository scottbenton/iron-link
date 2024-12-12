import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignPermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { GUIDE_NOTE_FOLDER_NAME } from "api-calls/notes/_getRef";
import { EditPermissions, NoteFolder } from "api-calls/notes/_notes.type";

import { useUID } from "stores/auth.store";
import { GamePermission } from "stores/game.store";

export interface NotePermissions {
  canChangePermissions: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isInGuideFolder: boolean;
}

export function useNotePermission(noteId: string): NotePermissions {
  const { writePermissions, noteAuthor, isNoteInGuideFolder } =
    useDerivedNotesAtom((state) => {
      const note = state.notes.notes[noteId];
      if (!note) {
        return {
          isNoteInGuideFolder: false,
        };
      }
      const noteAuthor = note.creator;

      const parentFolder = state.folders.folders[note.parentFolderId];
      if (!parentFolder) {
        return { noteAuthor, isNoteInGuideFolder: false };
      }

      let isNoteInGuideFolder = false;
      let folderIdToCheck: string | null = note.parentFolderId;
      while (folderIdToCheck) {
        if (folderIdToCheck === GUIDE_NOTE_FOLDER_NAME) {
          isNoteInGuideFolder = true;
          break;
        }
        const currentFolder: NoteFolder =
          state.folders.folders[folderIdToCheck];
        folderIdToCheck = currentFolder?.parentFolderId;
      }

      if (note.editPermissions) {
        return {
          writePermissions: note.editPermissions,
          noteAuthor,
          isNoteInGuideFolder,
        };
      }

      return {
        writePermissions: parentFolder.editPermissions,
        noteAuthor,
        isNoteInGuideFolder,
      };
    });

  const uid = useUID();
  const { gamePermission: campaignPermission } = useCampaignPermissions();

  if (!writePermissions || campaignPermission === GamePermission.Viewer) {
    return {
      canChangePermissions: false,
      canEdit: false,
      canDelete: false,
      isInGuideFolder: isNoteInGuideFolder,
    };
  }

  const isUserGuide = campaignPermission === GamePermission.Guide;
  const isUserNoteAuthor = noteAuthor === uid;
  const canChangePermissions = isNoteInGuideFolder
    ? isUserGuide
    : isUserNoteAuthor;

  if (writePermissions === EditPermissions.AllPlayers) {
    return {
      canEdit: true,
      canDelete: isUserNoteAuthor,
      canChangePermissions,
      isInGuideFolder: isNoteInGuideFolder,
    };
  }

  if (writePermissions === EditPermissions.OnlyAuthor) {
    return {
      canEdit: isUserNoteAuthor,
      canDelete: isUserNoteAuthor,
      canChangePermissions,
      isInGuideFolder: isNoteInGuideFolder,
    };
  }

  if (writePermissions === EditPermissions.GuidesAndAuthor) {
    return {
      canEdit: isUserGuide || isUserNoteAuthor,
      canDelete: isUserGuide || isUserNoteAuthor,
      canChangePermissions,
      isInGuideFolder: isNoteInGuideFolder,
    };
  }

  if (writePermissions === EditPermissions.OnlyGuides) {
    return {
      canEdit: isUserGuide,
      canDelete: isUserGuide,
      canChangePermissions,
      isInGuideFolder: isNoteInGuideFolder,
    };
  }

  return {
    canEdit: false,
    canDelete: false,
    canChangePermissions: false,
    isInGuideFolder: isNoteInGuideFolder,
  };
}
