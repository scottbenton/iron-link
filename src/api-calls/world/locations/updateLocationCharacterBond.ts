import { updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getLocationDoc } from "api-calls/world/locations/_getRef";

export const updateLocationCharacterBond = createApiFunction<
  {
    worldId: string;
    locationId: string;
    characterId: string;
    bonded: boolean;
  },
  void
>((params) => {
  const { worldId, locationId, characterId, bonded } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getLocationDoc(worldId, locationId), {
      [`characterBonds.${characterId}`]: bonded,
    })
      .then(() => resolve())
      .catch(reject);
  });
}, "Error updating location bonds.");
