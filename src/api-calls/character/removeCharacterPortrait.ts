import { constructCharacterPortraitFolderPath } from "api-calls/character/_getRef";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteImage } from "lib/storage.lib";

export const removeCharacterPortrait = createApiFunction<
  {
    characterId: string;
    oldPortraitFilename: string;
  },
  void
>((params) => {
  const { characterId, oldPortraitFilename } = params;

  return new Promise((resolve, reject) => {
    updateCharacter({
      characterId,
      character: {
        profileImage: null,
      },
    })
      .then(() => {
        deleteImage(
          constructCharacterPortraitFolderPath(characterId),
          oldPortraitFilename,
        )
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => reject(e));
  });
}, "Failed to remove old character portrait");
