import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import { CharacterDocument } from "./_character.type";

export function constructCharacterCollectionPath() {
  return `/characters`;
}

export function constructCharacterDocPath(characterId: string) {
  return `/characters/${characterId}`;
}

export function constructCharacterPortraitFolderPath(characterId: string) {
  return `/characters/${characterId}`;
}

export function constructCharacterPortraitPath(
  characterId: string,
  filename: string,
) {
  return `/characters/${characterId}/${filename}`;
}

export function getCharacterCollection() {
  return collection(
    firestore,
    constructCharacterCollectionPath(),
  ) as CollectionReference<CharacterDocument>;
}

export function getCharacterDoc(characterId: string) {
  return doc(
    firestore,
    constructCharacterDocPath(characterId),
  ) as DocumentReference<CharacterDocument>;
}
