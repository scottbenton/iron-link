import { PartialWithFieldValue, updateDoc } from "firebase/firestore";

import { getNoteDocument } from "./_getRef";
import { NoteDocument } from "./_notes.type";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateNote = createApiFunction<
  {
    campaignId: string;
    noteId: string;
    note: PartialWithFieldValue<NoteDocument>;
  },
  void
>((params) => {
  const { campaignId, noteId, note } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getNoteDocument(campaignId, noteId), note)
      .then(() => resolve())
      .catch((e) => reject(e));
  });
}, "Failed to update note.");
