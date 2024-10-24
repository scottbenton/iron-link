import { createApiFunction } from "api-calls/createApiFunction";
import { constructNPCImagesPath } from "api-calls/world/npcs/_getRef";
import { updateNPC } from "api-calls/world/npcs/updateNPC";
import { deleteImage } from "lib/storage.lib";

export const removeNPCImage = createApiFunction<
  {
    worldId: string;
    npcId: string;
    filename: string;
  },
  void
>((params) => {
  const { worldId, npcId, filename } = params;

  return new Promise((resolve, reject) => {
    updateNPC({
      worldId,
      npcId,
      npc: { imageFilenames: [] },
    })
      .then(() => {
        deleteImage(constructNPCImagesPath(worldId, npcId), filename).catch(
          () => console.error("Failed to remove image from storage."),
        );
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete npc image.");
