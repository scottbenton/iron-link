import { updateDoc } from "firebase/firestore";

import {
  constructCharacterPortraitFolderPath,
  getCharacterDoc,
} from "api-calls/character/_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { replaceImage } from "lib/storage.lib";

export const updateCharacterPortrait = createApiFunction<
  {
    characterId: string;
    oldPortraitFilename?: string;
    portrait?: File;
    scale: number;
    position: { x: number; y: number };
  },
  void
>((params) => {
  const { characterId, oldPortraitFilename, portrait, scale, position } =
    params;

  return new Promise((resolve, reject) => {
    let replaceImagePromise: Promise<void> | undefined;

    if (portrait) {
      replaceImagePromise = replaceImage(
        constructCharacterPortraitFolderPath(characterId),
        oldPortraitFilename,
        portrait,
      );
    } else {
      replaceImagePromise = Promise.resolve();
    }

    replaceImagePromise
      .then(() => {
        updateDoc(
          getCharacterDoc(characterId),
          portrait
            ? {
                profileImage: {
                  filename: portrait.name,
                  position,
                  scale,
                },
              }
            : {
                "profileImage.position": position,
                "profileImage.scale": scale,
              },
        )
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update character portrait");
