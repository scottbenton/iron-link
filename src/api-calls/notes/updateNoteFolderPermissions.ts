import { runTransaction } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { firestore } from "config/firebase.config";

import { getNoteDocument, getNoteFolderDocument } from "./_getRef";
import {
  EditPermissions,
  NoteDocument,
  NoteFolder,
  ReadPermissions,
} from "./_notes.type";

interface PermissionGroup {
  readPermissions: ReadPermissions;
  editPermissions: EditPermissions;
}

export const updateNoteFolderPermissions = createApiFunction<
  {
    campaignId: string;
    folderId: string;

    currentPermissions: PermissionGroup;
    nextPermissions: PermissionGroup;

    descendantFolders: Record<string, NoteFolder>;
    descendantNotes: Record<string, NoteDocument>;
  },
  void
>((params) => {
  const {
    campaignId,
    folderId,
    currentPermissions,
    nextPermissions,
    descendantFolders,
    descendantNotes,
  } = params;

  return new Promise((resolve, reject) => {
    runTransaction(firestore, async (transaction) => {
      transaction.update(getNoteFolderDocument(campaignId, folderId), {
        readPermissions: nextPermissions.readPermissions,
        editPermissions: nextPermissions.editPermissions,
      });

      Object.entries(descendantFolders).forEach(([folderId, folder]) => {
        if (
          arePermissionGroupsEqual(
            {
              readPermissions: folder.readPermissions,
              editPermissions: folder.editPermissions,
            },
            currentPermissions,
          )
        ) {
          transaction.update(getNoteFolderDocument(campaignId, folderId), {
            readPermissions: nextPermissions.readPermissions,
            editPermissions: nextPermissions.editPermissions,
          });
        }
      });

      Object.entries(descendantNotes).forEach(([noteId, note]) => {
        if (
          note.readPermissions &&
          note.editPermissions &&
          arePermissionGroupsEqual(
            {
              readPermissions: note.readPermissions,
              editPermissions: note.editPermissions,
            },
            currentPermissions,
          )
        ) {
          transaction.update(getNoteDocument(campaignId, noteId), {
            readPermissions: nextPermissions.readPermissions,
            editPermissions: nextPermissions.editPermissions,
          });
        }
      });
    })
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to update note permissions.");

function arePermissionGroupsEqual(
  a: PermissionGroup,
  b: PermissionGroup,
): boolean {
  return (
    a.readPermissions === b.readPermissions &&
    a.editPermissions === b.editPermissions
  );
}
