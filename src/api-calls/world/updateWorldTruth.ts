import { updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { Truth } from "api-calls/world/_world.type";

import { getWorldDoc } from "./_getRef";

export const updateWorldTruth = createApiFunction<
  { worldId: string; truthKey: string; truth: Truth },
  void
>((params) => {
  const { worldId, truthKey, truth } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getWorldDoc(worldId), {
      [`newTruths.${truthKey}`]: truth,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update world truth.");
