import { getDoc } from "firebase/firestore";

import { CharacterDocument } from "./_character.type";
import { getCharacterDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const getCharacter = createApiFunction<string, CharacterDocument>(
  (characterId) => {
    return new Promise((resolve, reject) => {
      getDoc(getCharacterDoc(characterId))
        .then((doc) => {
          const character = doc.data();
          if (!character) {
            reject("Character not found.");
            return;
          }
          resolve(character);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  "Failed to load character.",
);
