import { addDoc, Timestamp } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getLoreCollection } from "api-calls/world/lore/_getRef";

export const createLore = createApiFunction<
  { worldId: string; shared?: boolean },
  string
>((params) => {
  const { worldId } = params;
  return new Promise((resolve, reject) => {
    addDoc(getLoreCollection(worldId), {
      name: "New Lore Document",
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
}, "Failed to create a new lore document.");
