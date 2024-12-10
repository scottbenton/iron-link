import {
  CollectionReference,
  DocumentReference,
  PartialWithFieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import { CharacterRepository } from "./character.repository";
import { convertUnknownErrorToStorageError } from "./errors/storageErrors";
import { GameRepostiory } from "./game.repository";

export interface AssetDTO {
  id: string;
  enabledAbilities: Record<number, boolean>;
  optionValues?: Record<string, string>;
  controlValues?: Record<string, boolean | string | number>;
  order: number;
  shared: boolean;
}

export type PartialAssetDTO = PartialWithFieldValue<AssetDTO>;

export class AssetRepository {
  public static collectionName = "assets";

  public static getCharacterAssetCollectionName(characterId: string): string {
    return `${CharacterRepository.collectionName}/${characterId}/${this.collectionName}`;
  }
  private static getCharacterAssetCollectionRef(characterId: string) {
    return collection(
      firestore,
      this.getCharacterAssetCollectionName(characterId),
    ) as CollectionReference<AssetDTO>;
  }
  private static getCharacterAssetCollectionDocRef(
    characterId: string,
    assetId: string,
  ) {
    return doc(
      firestore,
      `${this.getCharacterAssetCollectionName(characterId)}/${assetId}`,
    ) as DocumentReference<AssetDTO>;
  }

  public static getGameAssetCollectionName(gameId: string): string {
    return `${GameRepostiory.collectionName}/${gameId}/${this.collectionName}`;
  }
  private static getGameAssetCollectionRef(gameId: string) {
    return collection(
      firestore,
      this.getGameAssetCollectionName(gameId),
    ) as CollectionReference<AssetDTO>;
  }
  private static getGameAssetCollectionDocRef(gameId: string, assetId: string) {
    return doc(
      firestore,
      `${this.getGameAssetCollectionName(gameId)}/${assetId}`,
    ) as DocumentReference<AssetDTO>;
  }

  public static async createCharacterAsset(
    characterId: string,
    assetDTO: AssetDTO,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      addDoc(this.getCharacterAssetCollectionRef(characterId), assetDTO)
        .then((docRef) => {
          resolve(docRef.id);
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Character asset could not be created`,
            ),
          );
        });
    });
  }

  public static async createGameAsset(
    gameId: string,
    assetDTO: AssetDTO,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      addDoc(this.getGameAssetCollectionRef(gameId), assetDTO)
        .then((docRef) => {
          resolve(docRef.id);
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Game asset could not be created`,
            ),
          );
        });
    });
  }

  private static listenToAssets(
    collectionRef: CollectionReference<AssetDTO>,
    onAssets: (assets: Record<string, AssetDTO>) => void,
    onError: (error: Error) => void,
  ): () => void {
    return onSnapshot(
      collectionRef,
      (snapshot) => {
        const assets: Record<string, AssetDTO> = {};
        snapshot.docs.forEach((doc) => {
          if (doc.exists()) {
            assets[doc.id] = doc.data() as AssetDTO;
          }
        });
        onAssets(assets);
      },
      (error) => {
        onError(
          convertUnknownErrorToStorageError(error, `Error listening to assets`),
        );
      },
    );
  }

  public static listenToCharacterAssets(
    characterId: string,
    onAssets: (assets: Record<string, AssetDTO>) => void,
    onError: (error: Error) => void,
  ): () => void {
    return this.listenToAssets(
      this.getCharacterAssetCollectionRef(characterId),
      onAssets,
      onError,
    );
  }

  public static listenToGameAssets(
    gameId: string,
    onAssets: (assets: Record<string, AssetDTO>) => void,
    onError: (error: Error) => void,
  ): () => void {
    return this.listenToAssets(
      this.getGameAssetCollectionRef(gameId),
      onAssets,
      onError,
    );
  }

  private static removeAsset(
    collectionRef: CollectionReference<AssetDTO>,
    assetId: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      deleteDoc(doc(collectionRef, assetId))
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Asset could not be removed`,
            ),
          );
        });
    });
  }

  public static removeCharacterAsset(
    characterId: string,
    assetId: string,
  ): Promise<void> {
    return this.removeAsset(
      this.getCharacterAssetCollectionRef(characterId),
      assetId,
    );
  }

  public static removeGameAsset(
    gameId: string,
    assetId: string,
  ): Promise<void> {
    return this.removeAsset(this.getGameAssetCollectionRef(gameId), assetId);
  }

  private static updateAsset(
    collectionRef: CollectionReference<AssetDTO>,
    assetId: string,
    assetDTO: PartialAssetDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const docRef = doc(collectionRef, assetId);
      updateDoc(docRef, assetDTO)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Asset could not be updated`,
            ),
          );
        });
    });
  }

  public static updateCharacterAsset(
    characterId: string,
    assetId: string,
    assetDTO: PartialAssetDTO,
  ): Promise<void> {
    return this.updateAsset(
      this.getCharacterAssetCollectionRef(characterId),
      assetId,
      assetDTO,
    );
  }

  public static updateGameAsset(
    gameId: string,
    assetId: string,
    assetDTO: PartialAssetDTO,
  ): Promise<void> {
    return this.updateAsset(
      this.getGameAssetCollectionRef(gameId),
      assetId,
      assetDTO,
    );
  }
}
