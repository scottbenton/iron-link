import { updateDoc } from "firebase/firestore";

import { getNoteDocument } from "./_getRef";
import { NoteDocument } from "./_notes.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateNotePermissions = createApiFunction<
  {
    campaignId: string;
    noteId: string;
    readPermissions: NoteDocument["readPermissions"];
    editPermissions: NoteDocument["editPermissions"];
  },
  void
>((params) => {
  const { campaignId, noteId, readPermissions, editPermissions } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNoteDocument(campaignId, noteId), {
      readPermissions,
      editPermissions,
    })
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to update note permissions.");
