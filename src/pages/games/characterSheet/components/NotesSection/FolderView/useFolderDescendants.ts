import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";

import { NoteDocument, NoteFolder } from "api-calls/notes/_notes.type";

export interface FolderDescendants {
  folders: Record<string, NoteFolder>;
  notes: Record<string, NoteDocument>;
}

export function useFolderDescendants(
  folderId: string | undefined,
): FolderDescendants {
  return useDerivedNotesAtom((state) => {
    if (folderId === undefined) {
      return {
        folders: {},
        notes: {},
      };
    }
    const checkedFolderMap: Record<string, boolean> = {};
    const folders: Record<string, NoteFolder> = {};
    const notes: Record<string, NoteDocument> = {};

    const allFolders = state.folders.folders;

    function processAncestorsAndReturnResult(testingFolderId: string): boolean {
      if (testingFolderId in checkedFolderMap) {
        return checkedFolderMap[testingFolderId];
      }

      if (testingFolderId === folderId) {
        checkedFolderMap[testingFolderId] = true;
        folders[testingFolderId] = allFolders[testingFolderId];
        return true;
      }

      const folder = allFolders[testingFolderId];
      if (!folder) {
        return false;
      }
      if (folder.parentFolderId) {
        const result = processAncestorsAndReturnResult(folder.parentFolderId);
        checkedFolderMap[testingFolderId] = result;
        if (result) {
          folders[testingFolderId] = folder;
        }
        return result;
      }
      return false;
    }

    Object.keys(allFolders).forEach((id) => {
      if (processAncestorsAndReturnResult(id)) {
        checkedFolderMap[id] = true;
      }
    });

    Object.entries(state.notes.notes).forEach(([noteId, note]) => {
      const parentFolder = note.parentFolderId;
      if (checkedFolderMap[parentFolder]) {
        notes[noteId] = note;
      }
    });

    return {
      folders,
      notes,
    };
  });
}
