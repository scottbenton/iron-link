import { Unsubscribe } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";

import { getPrivateDetailsLocationDoc } from "api-calls/world/locations/_getRef";
import { getErrorMessage } from "lib/getErrorMessage";
import { GMLocation } from "types/Locations.type";

export function listenToLocationGMProperties(
  worldId: string,
  locationId: string,
  updateGMProperties: (properties: GMLocation | undefined) => void,
  onError: (error: string) => void,
): Unsubscribe {
  return onSnapshot(
    getPrivateDetailsLocationDoc(worldId, locationId),
    (snapshot) => {
      const gmProps = snapshot.data();
      const newProps: GMLocation = {
        ...gmProps,
        gmNotes: gmProps?.gmNotes?.toUint8Array(),
      };
      updateGMProperties(newProps);
    },
    (error) => {
      onError(getErrorMessage(error, "Failed to get location gm notes"));
    },
  );
}
