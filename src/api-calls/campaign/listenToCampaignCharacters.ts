import { Unsubscribe, onSnapshot } from "firebase/firestore";

import { CharacterDTO } from "repositories/character.repository";

import { getCharacterDoc } from "../character/_getRef";

interface Params {
  characterIdList: string[];
  onDocChange: (id: string, character?: CharacterDTO) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void;
}

export function listenToCampaignCharacters(params: Params): Unsubscribe[] {
  const { characterIdList, onDocChange, onError } = params;

  const unsubscribes = (characterIdList || []).map((characterId) => {
    return onSnapshot(
      getCharacterDoc(characterId),
      (snapshot) => {
        const characterDoc = snapshot.data();
        onDocChange(characterId, characterDoc);
      },
      (error) => {
        console.error(error);
        onError(new Error("Failed to fetch characters."));
      },
    );
  });
  return unsubscribes;
}
