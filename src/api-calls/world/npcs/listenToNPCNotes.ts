import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";

import { getErrorMessage } from "lib/getErrorMessage";

import { getPublicNotesNPCDoc } from "./_getRef";

export function listenToNPCNotes(
  worldId: string,
  npcId: string,
  updateNPCNotes: (notes: Uint8Array | undefined) => void,
  onError: (error: string) => void,
): Unsubscribe {
  return onSnapshot(
    getPublicNotesNPCDoc(worldId, npcId),
    (snapshot) => {
      const notes = snapshot.data()?.notes?.toUint8Array();
      updateNPCNotes(notes);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get npc notes"));
    },
  );
}
