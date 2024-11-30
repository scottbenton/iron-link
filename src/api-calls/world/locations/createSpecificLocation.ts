import { addDoc } from "firebase/firestore";

import { Location } from "types/Locations.type";

import { createApiFunction } from "api-calls/createApiFunction";

import { convertToDatabase, getLocationCollection } from "./_getRef";

export const createSpecificLocation = createApiFunction<
  { worldId: string; location: Location },
  string
>((params) => {
  const { worldId, location } = params;
  return new Promise((resolve, reject) => {
    addDoc(getLocationCollection(worldId), convertToDatabase(location))
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create a new location.");
