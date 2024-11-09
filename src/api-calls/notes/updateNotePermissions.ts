import { updateDoc } from "firebase/firestore";

import { getNoteDocument } from "./_getRef";
import { NoteDocument } from "./_notes.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateNoteShared = createApiFunction<
  {
    campaignId: string;
    noteId: string;
    viewPermissions: NoteDocument["viewPermissions"];
    writePermissions: NoteDocument["writePermissions"];
  },
  void
>((params) => {
  const { campaignId, noteId, viewPermissions, writePermissions } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNoteDocument(campaignId, noteId), {
      viewPermissions,
      writePermissions,
    })
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to update note permissions.");
