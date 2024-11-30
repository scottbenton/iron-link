import { setDoc } from "firebase/firestore";

import { GMNPC } from "types/NPCs.type";

import { createApiFunction } from "api-calls/createApiFunction";

import { getPrivateDetailsNPCDoc } from "./_getRef";

interface Params {
  worldId: string;
  npcId: string;
  npcGMProperties: Partial<GMNPC>;
}

export const updateNPCGMProperties = createApiFunction<Params, void>(
  (params) => {
    const { worldId, npcId, npcGMProperties } = params;

    return new Promise((resolve, reject) => {
      setDoc(getPrivateDetailsNPCDoc(worldId, npcId), npcGMProperties, {
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
  "Failed to update npc.",
);
