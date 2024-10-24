import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";

import { getPublicNotesLoreDoc } from "api-calls/world/lore/_getRef";
import { getErrorMessage } from "lib/getErrorMessage";

export function listenToLoreNotes(
  worldId: string,
  loreId: string,
  updateLoreNotes: (notes: Uint8Array | undefined) => void,
  onError: (error: string) => void,
): Unsubscribe {
  return onSnapshot(
    getPublicNotesLoreDoc(worldId, loreId),
    (snapshot) => {
      const notes = snapshot.data()?.notes?.toUint8Array();
      updateLoreNotes(notes);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get lore document notes"));
    },
  );
}
