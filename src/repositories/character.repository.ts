import {
  CollectionReference,
  DocumentReference,
  PartialWithFieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import { ICharacter } from "services/character.service";

import {
  NotFoundError,
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";
import { ColorScheme, SpecialTrack } from "./shared.types";
import { StorageRepository } from "./storage.repository";

export type StatsMap = Record<string, number>;
export enum InitiativeStatus {
  HasInitiative = "initiative",
  DoesNotHaveInitiative = "noInitiative",
  OutOfCombat = "outOfCombat",
}
export interface CharacterDTO {
  uid: string;
  gameId: string;

  name: string;
  stats: StatsMap;
  conditionMeters: Record<string, number>; // Health, Sprit, Supply, etc.

  initiativeStatus: InitiativeStatus;
  momentum: number;

  specialTracks: Record<string, SpecialTrack>; // Bonds, Quests, Discoveries, etc.

  debilities: Record<string, boolean>;
  adds: number;

  profileImage: {
    filename: string;
    position: {
      x: number;
      y: number;
    };
    scale: number;
  } | null;

  unspentExperience: number;
  colorScheme: ColorScheme | null;
}
export type PartialCharacterDTO = PartialWithFieldValue<CharacterDTO>;

export class CharacterRepository {
  public static collectionName = "characters";
  private static collectionRef = collection(
    firestore,
    this.collectionName,
  ) as CollectionReference<CharacterDTO>;
  private static getCharacterDocRef(
    characterId: string,
  ): DocumentReference<CharacterDTO> {
    return doc(
      firestore,
      `${this.collectionName}/${characterId}`,
    ) as DocumentReference<CharacterDTO>;
  }

  public static async getCharacter(characterId: string): Promise<CharacterDTO> {
    return new Promise((resolve, reject) => {
      getDoc(this.getCharacterDocRef(characterId))
        .then((doc) => {
          if (doc.exists()) {
            resolve(doc.data() as CharacterDTO);
          } else {
            reject(
              new NotFoundError(
                `Character with id ${characterId} could not be found`,
              ),
            );
          }
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Character with id ${characterId} could not be found`,
            ),
          );
        });
    });
  }
  public static async getCharactersInGames(
    gameIds: string[],
  ): Promise<Record<string, CharacterDTO>> {
    return new Promise((resolve, reject) => {
      if (gameIds.length === 0) {
        resolve({});
        return;
      }
      getDocs(query(this.collectionRef, where("gameId", "in", gameIds)))
        .then((snapshot) => {
          const characters: Record<string, CharacterDTO> = {};
          snapshot.docs.forEach((doc) => {
            if (doc.exists()) {
              characters[doc.id] = doc.data() as CharacterDTO;
            }
          });
          resolve(characters);
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Characters could not be found`,
            ),
          );
        });
    });
  }

  public static listenToCharacter(
    characterId: string,
    onUpdate: (character: CharacterDTO) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return onSnapshot(
      this.getCharacterDocRef(characterId),
      (doc) => {
        if (doc.exists()) {
          onUpdate(doc.data() as CharacterDTO);
        } else {
          onError(
            new NotFoundError(
              `Character with id ${characterId} could not be found`,
            ),
          );
        }
      },
      (error) => {
        onError(
          convertUnknownErrorToStorageError(
            error,
            `Character with id ${characterId} could not be found`,
          ),
        );
      },
    );
  }

  public static listenToGameCharacters(
    gameId: string,
    onUpdate: (
      changedCharacters: Record<string, ICharacter>,
      removedCharacterIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    const queryRef = query(this.collectionRef, where("gameId", "==", gameId));
    return onSnapshot(
      queryRef,
      (snapshot) => {
        const changedCharacters: Record<string, ICharacter> = {};
        const removedCharacterIds: string[] = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            removedCharacterIds.push(change.doc.id);
          } else {
            changedCharacters[change.doc.id] = change.doc.data() as ICharacter;
          }
        });

        onUpdate(changedCharacters, removedCharacterIds);
      },
      (error) => {
        onError(
          convertUnknownErrorToStorageError(
            error,
            `Characters in game with id ${gameId} could not be loaded`,
          ),
        );
      },
    );
  }

  public static async createCharacter(
    character: CharacterDTO,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      addDoc(this.collectionRef, character)
        .then((doc) => {
          resolve(doc.id);
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Failed to create character with name ${character.name}`,
            ),
          );
        });
    });
  }

  public static async getCharacterImageLink(
    characterId: string,
    filename: string,
  ) {
    return StorageRepository.getImageUrl(
      `${this.collectionName}/${characterId}`,
      filename,
    );
  }

  public static async uploadCharacterImage(
    characterId: string,
    file: File,
  ): Promise<void> {
    return StorageRepository.storeImage(
      `${this.collectionName}/${characterId}`,
      file,
    );
  }

  public static async deleteCharacterPortrait(
    characterId: string,
    filename: string,
  ): Promise<void> {
    return StorageRepository.deleteImage(
      `${this.collectionName}/${characterId}`,
      filename,
    );
  }

  public static async updateCharacter(
    characterId: string,
    character: PartialCharacterDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      updateDoc(this.getCharacterDocRef(characterId), character)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Failed to update character with id ${characterId}`,
            ),
          );
        });
    });
  }

  public static async deleteCharacter(characterId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      deleteDoc(this.getCharacterDocRef(characterId))
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Failed to remove character with id ${characterId}`,
            ),
          );
        });
    });
  }
}
