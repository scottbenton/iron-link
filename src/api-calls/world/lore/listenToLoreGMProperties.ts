import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";

import { GMLore } from "types/Lore.type";

import { getErrorMessage } from "lib/getErrorMessage";

import { getPrivateDetailsLoreDoc } from "./_getRef";

export function listenToLoreGMProperties(
  worldId: string,
  loreId: string,
  updateGMProperties: (properties: GMLore | undefined) => void,
  onError: (error: string) => void,
): Unsubscribe {
  return onSnapshot(
    getPrivateDetailsLoreDoc(worldId, loreId),
    (snapshot) => {
      const gmProps = snapshot.data();
      const newProps: GMLore = {
        ...gmProps,
        gmNotes: gmProps?.gmNotes?.toUint8Array(),
      };
      updateGMProperties(newProps);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get lore document gm notes"));
    },
  );
}
