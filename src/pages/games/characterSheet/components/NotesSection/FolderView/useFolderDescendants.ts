import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";

export interface FolderDescendants {
  folderIds: string[];
  noteIds: string[];
}

export function useFolderDescendants(folderId: string): FolderDescendants {
  return useDerivedNotesAtom((state) => {
    const folderMap: Record<string, boolean> = {};
    const noteIds: string[] = [];

    const allFolders = state.folders.folders;

    function processAncestorsAndReturnResult(testingFolderId: string): boolean {
      if (testingFolderId in folderMap) {
        return folderMap[testingFolderId];
      }

      if (testingFolderId === folderId) {
        folderMap[testingFolderId] = true;
        return true;
      }

      const folder = allFolders[testingFolderId];
      if (!folder) {
        return false;
      }
      if (folder.parentFolderId) {
        return processAncestorsAndReturnResult(folder.parentFolderId);
      }
      return false;
    }

    Object.keys(allFolders).forEach((id) => {
      if (processAncestorsAndReturnResult(id)) {
        folderMap[id] = true;
      }
    });

    Object.entries(state.notes.notes).forEach(([noteId, note]) => {
      const parentFolder = note.parentFolderId;
      if (folderMap[parentFolder]) {
        noteIds.push(noteId);
      }
    });

    return {
      folderIds: Object.keys(folderMap).filter((id) => folderMap[id]),
      noteIds,
    };
  });
}
