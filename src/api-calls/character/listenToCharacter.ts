import { onSnapshot } from "firebase/firestore";

import { CharacterDTO } from "repositories/character.repository";

import { getCharacterDoc } from "./_getRef";

export function listenToCharacter(
  characterId: string,
  onCharacter: (character: CharacterDTO) => void,
  onError: (error: unknown) => void,
) {
  return onSnapshot(
    getCharacterDoc(characterId),
    (snapshot) => {
      const character = snapshot.data();
      if (character) {
        onCharacter(character);
      } else {
        onError("No character found");
      }
    },
    (error) => onError(error),
  );
}
