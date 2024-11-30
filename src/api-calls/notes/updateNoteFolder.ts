import { PartialWithFieldValue, updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { getNoteFolderDocument } from "./_getRef";
import { NoteFolder } from "./_notes.type";

export const updateNoteFolder = createApiFunction<
  {
    campaignId: string;
    folderId: string;
    noteFolder: PartialWithFieldValue<NoteFolder>;
  },
  void
>((params) => {
  const { campaignId, folderId, noteFolder } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNoteFolderDocument(campaignId, folderId), noteFolder)
      .then(() => resolve())
      .catch((e) => reject(e));
  });
}, "Failed to update note folder.");
