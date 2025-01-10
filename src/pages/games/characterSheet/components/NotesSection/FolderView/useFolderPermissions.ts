import { useNotesStore } from "stores/notes.store";

export interface FolderPermissions {
  canChangePermissions: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export function useFolderPermission(folderId: string): FolderPermissions {
  return useNotesStore((store) => {
    return (
      store.folderState.permissions[folderId] ?? {
        canChangePermissions: false,
        canEdit: false,
        canDelete: false,
      }
    );
  });
}
