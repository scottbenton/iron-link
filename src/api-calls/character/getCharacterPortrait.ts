import { constructCharacterPortraitPath } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { getImageUrl } from "lib/storage.lib";

export const getCharacterPortraitUrl = createApiFunction<
  {
    characterId: string;
    filename: string;
  },
  string
>((params) => {
  const { characterId, filename } = params;
  return new Promise((resolve, reject) => {
    getImageUrl(constructCharacterPortraitPath(characterId, filename))
      .then((url) => resolve(url))
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
}, "Failed to load character portrait.");
