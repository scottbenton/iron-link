import { addDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { encodeWorld, getWorldCollection } from "api-calls/world/_getRef";
import { World } from "api-calls/world/_world.type";

export const createWorld = createApiFunction<World, string>((world) => {
  return new Promise((resolve, reject) => {
    addDoc(getWorldCollection(), encodeWorld(world))
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create world");
