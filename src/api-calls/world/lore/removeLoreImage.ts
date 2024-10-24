import { createApiFunction } from "api-calls/createApiFunction";
import { constructLoreImagesPath } from "api-calls/world/lore/_getRef";
import { updateLore } from "api-calls/world/lore/updateLore";
import { deleteImage } from "lib/storage.lib";

export const removeLoreImage = createApiFunction<
  {
    worldId: string;
    loreId: string;
    filename: string;
  },
  void
>((params) => {
  const { worldId, loreId, filename } = params;

  return new Promise((resolve, reject) => {
    updateLore({
      worldId,
      loreId,
      lore: { imageFilenames: [] },
    })
      .then(() => {
        deleteImage(constructLoreImagesPath(worldId, loreId), filename).catch(
          () => console.error("Failed to remove image from storage."),
        );
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete lore image.");
