import { useGamePermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { useUID } from "stores/auth.store";
import { GamePermission } from "stores/game.store";
import { useNotesStore } from "stores/notes.store";

import { EditPermissions } from "repositories/shared.types";

export interface NotePermissions {
  canChangePermissions: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function useNotePermission(noteId: string): NotePermissions {
  const { writePermissions, noteAuthor } = useNotesStore((store) => {
    const note = store.noteState.notes[noteId];
    if (!note) {
      return {
        isNoteInGuideFolder: false,
      };
    }
    const noteAuthor = note.creator;

    const parentFolder = store.folderState.folders[note.parentFolderId];
    if (!parentFolder) {
      return { noteAuthor, isNoteInGuideFolder: false };
    }

    if (note.editPermissions) {
      return {
        writePermissions: note.editPermissions,
        noteAuthor,
      };
    }

    return {
      writePermissions: parentFolder.editPermissions,
      noteAuthor,
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
  const isUserNoteAuthor = noteAuthor === uid;

  if (writePermissions === EditPermissions.AllPlayers) {
    return {
      canEdit: true,
      canDelete: isUserNoteAuthor,
      canChangePermissions: isUserNoteAuthor,
    };
  }

  if (writePermissions === EditPermissions.OnlyAuthor) {
    return {
      canEdit: isUserNoteAuthor,
      canDelete: isUserNoteAuthor,
      canChangePermissions: isUserNoteAuthor,
    };
  }

  if (writePermissions === EditPermissions.GuidesAndAuthor) {
    return {
      canEdit: isUserGuide || isUserNoteAuthor,
      canDelete: isUserGuide || isUserNoteAuthor,
      canChangePermissions: isUserNoteAuthor,
    };
  }

  if (writePermissions === EditPermissions.OnlyGuides) {
    return {
      canEdit: isUserGuide,
      canDelete: isUserGuide,
      canChangePermissions: isUserGuide,
    };
  }

  return {
    canEdit: false,
    canDelete: false,
    canChangePermissions: false,
  };
}
