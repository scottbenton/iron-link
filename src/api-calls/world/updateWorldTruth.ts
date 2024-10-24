import { updateDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";
import { getWorldDoc } from "api-calls/world/_getRef";
import { Truth } from "api-calls/world/_world.type";

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
