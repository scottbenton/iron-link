import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";

import { getPrivateDetailsNPCDoc } from "api-calls/world/npcs/_getRef";
import { getErrorMessage } from "lib/getErrorMessage";
import { GMNPC } from "types/NPCs.type";

export function listenToNPCGMProperties(
  worldId: string,
  npcId: string,
  updateGMProperties: (properties: GMNPC | undefined) => void,
  onError: (error: string) => void,
): Unsubscribe {
  return onSnapshot(
    getPrivateDetailsNPCDoc(worldId, npcId),
    (snapshot) => {
      const gmProps = snapshot.data();
      const newProps: GMNPC = {
        ...gmProps,
        gmNotes: gmProps?.gmNotes?.toUint8Array(),
      };
      updateGMProperties(newProps);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get npc gm notes"));
    },
  );
}
