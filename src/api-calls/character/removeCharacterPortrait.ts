import { createApiFunction } from "api-calls/createApiFunction";

import { deleteImage } from "lib/storage.lib";

import { constructCharacterPortraitFolderPath } from "./_getRef";
import { updateCharacter } from "./updateCharacter";

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
