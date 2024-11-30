import { Unsubscribe, onSnapshot } from "firebase/firestore";

import { getNoteContentDocument } from "api-calls/notes/_getRef";

export function listenToNoteContent(
  campaignId: string,
  noteId: string,
  onContent: (content?: Uint8Array) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void,
): Unsubscribe {
  return onSnapshot(
    getNoteContentDocument(campaignId, noteId),
    (snapshot) => {
      const data = snapshot.data();
      if (data?.notes) {
        onContent(data.notes.toUint8Array());
      } else {
        onContent(undefined);
      }
    },
    (error) => onError(error),
  );
}
