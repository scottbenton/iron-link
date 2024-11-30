import { Timestamp, addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { getLocationCollection } from "./_getRef";

export const createLocation = createApiFunction<
  { worldId: string; shared?: boolean },
  string
>((params) => {
  const { worldId } = params;
  return new Promise((resolve, reject) => {
    addDoc(getLocationCollection(worldId), {
      name: "New Location",
      sharedWithPlayers: true,
      updatedTimestamp: Timestamp.now(),
      createdTimestamp: Timestamp.now(),
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create a new location.");
