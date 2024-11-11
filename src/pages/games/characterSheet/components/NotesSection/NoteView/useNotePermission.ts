import { WritePermissions } from "api-calls/notes/_notes.type";
import { useUID } from "atoms/auth.atom";
import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";
import {
  CampaignPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

export interface NotePermissions {
  canEdit: boolean;
  canDelete: boolean;
}

export function useNotePermission(noteId: string): NotePermissions {
  const { writePermissions, noteAuthor } = useDerivedNotesAtom((state) => {
    const note = state.notes.notes[noteId];
    if (!note) {
      return {};
    }
    const noteAuthor = note.creator;

    if (note.writePermissions) {
      return { writePermissions: note.writePermissions, noteAuthor };
    }

    const parentFolder = state.folders.folders[note.parentFolderId];
    if (!parentFolder) {
      return { noteAuthor };
    }
    return { writePermissions: parentFolder.writePermissions, noteAuthor };
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
  const isUserNoteAuthor = noteAuthor === uid;

  if (writePermissions.type === WritePermissions.AllPlayers) {
    return {
      canEdit: true,
      canDelete: isUserNoteAuthor,
    };
  }

  if (writePermissions.type === WritePermissions.OnlyAuthor) {
    return {
      canEdit: isUserNoteAuthor,
      canDelete: isUserNoteAuthor,
    };
  }

  if (writePermissions.type === WritePermissions.GuidesAndPlayerSubset) {
    const isGuideOrInPlayerSubset =
      isUserGuide || writePermissions.players?.includes(uid) || false;

    return {
      canEdit: isGuideOrInPlayerSubset,
      canDelete: isGuideOrInPlayerSubset,
    };
  }

  if (writePermissions.type === WritePermissions.OnlyGuides) {
    return {
      canEdit: isUserGuide,
      canDelete: isUserGuide,
    };
  }

  return {
    canEdit: false,
    canDelete: false,
  };
}
