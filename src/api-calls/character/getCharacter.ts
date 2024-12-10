import { getDoc } from "firebase/firestore";

import { createApiFunction } from "api-calls/createApiFunction";

import { CharacterDTO } from "repositories/character.repository";

import { getCharacterDoc } from "./_getRef";

export const getCharacter = createApiFunction<string, CharacterDTO>(
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
