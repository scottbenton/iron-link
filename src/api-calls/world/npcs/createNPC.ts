import { Timestamp, addDoc } from "firebase/firestore";

import { NPC } from "types/NPCs.type";

import { createApiFunction } from "api-calls/createApiFunction";

import { getNPCCollection } from "./_getRef";

export const createNPC = createApiFunction<
  { worldId: string; npc?: Partial<NPC> },
  string
>((params) => {
  const { worldId, npc } = params;
  return new Promise((resolve, reject) => {
    addDoc(getNPCCollection(worldId), {
      name: "New NPC",
      sharedWithPlayers: true,
      updatedTimestamp: Timestamp.now(),
      createdTimestamp: Timestamp.now(),
      ...npc,
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create a new npc.");
