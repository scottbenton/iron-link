import { setDoc } from "firebase/firestore";

import { GMLore } from "types/Lore.type";

import { createApiFunction } from "api-calls/createApiFunction";

import { getPrivateDetailsLoreDoc } from "./_getRef";

interface Params {
  worldId: string;
  loreId: string;
  loreGMProperties: Partial<GMLore>;
}

export const updateLoreGMProperties = createApiFunction<Params, void>(
  (params) => {
    const { worldId, loreId, loreGMProperties } = params;

    return new Promise((resolve, reject) => {
      setDoc(getPrivateDetailsLoreDoc(worldId, loreId), loreGMProperties, {
        merge: true,
      })
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  "Failed to update lore document.",
);
