import {
  CollectionReference,
  DocumentData,
  Query,
  QuerySnapshot,
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  or,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { GamePermission } from "stores/game.store";

import { firestore } from "config/firebase.config";

import {
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";
import { GameRepostiory } from "./game.repository";
import { EditPermissions, ReadPermissions } from "./shared.types";

export interface NoteFolderDTO {
  name: string;
  order: number;
  // Null if this is a root folder
  parentFolderId: string | null;
  creator: string;

  // Permission sets cannot be null - if we update a parent, we need to manually update children
  readPermissions: ReadPermissions;
  editPermissions: EditPermissions;
}

export type PartialNoteFolderDTO = Partial<NoteFolderDTO>;

export class NoteFoldersRepository {
  private static collectionName = "note-folders";
  private static getNoteFolderCollectionName(gameId: string): string {
    return `${GameRepostiory.collectionName}/${gameId}/${this.collectionName}`;
  }
  private static getNoteFolderCollectionRef(gameId: string) {
    return collection(
      firestore,
      this.getNoteFolderCollectionName(gameId),
    ) as CollectionReference<NoteFolderDTO>;
  }
  private static getNoteFolderDocumentRef(
    gameId: string,
    noteFolderId: string,
  ) {
    return doc(this.getNoteFolderCollectionRef(gameId), noteFolderId);
  }

  public static listenToNoteFolders(
    uid: string | undefined,
    gameId: string,
    permissions: GamePermission,
    onNoteFolderChanges: (
      changedNoteFolders: Record<string, NoteFolderDTO>,
      deletedNoteFolderIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    let noteFolderQuery: Query<NoteFolderDTO, DocumentData> = query(
      this.getNoteFolderCollectionRef(gameId),
      where("readPermissions", "==", ReadPermissions.Public),
    );
    const basePlayerPermissions = [
      where("readPermissions", "==", ReadPermissions.Public),
      where("readPermissions", "==", ReadPermissions.AllPlayers),
      and(
        where("readPermissions", "==", ReadPermissions.OnlyAuthor),
        where("creator", "==", uid),
      ),
      and(
        where("readPermissions", "==", ReadPermissions.GuidesAndAuthor),
        where("creator", "==", uid),
      ),
    ];
    if (permissions === GamePermission.Player) {
      noteFolderQuery = query(
        this.getNoteFolderCollectionRef(gameId),
        or(...basePlayerPermissions),
      );
    } else if (permissions === GamePermission.Guide) {
      noteFolderQuery = query(
        this.getNoteFolderCollectionRef(gameId),
        or(
          ...basePlayerPermissions,
          where("readPermissions", "==", ReadPermissions.OnlyGuides),
          where("readPermissions", "==", ReadPermissions.GuidesAndAuthor),
        ),
      );
    }

    return onSnapshot(
      noteFolderQuery,
      (snapshot: QuerySnapshot<NoteFolderDTO>) => {
        const changedNoteFolders: Record<string, NoteFolderDTO> = {};
        const deletedNoteFolderIds: string[] = [];

        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            deletedNoteFolderIds.push(change.doc.id);
          } else {
            changedNoteFolders[change.doc.id] =
              change.doc.data() as NoteFolderDTO;
          }
        });
        onNoteFolderChanges(changedNoteFolders, deletedNoteFolderIds);
      },
      (error) => {
        console.debug(error);
        onError(
          convertUnknownErrorToStorageError(
            error,
            `Error listening to note folders`,
          ),
        );
      },
    );
  }

  public static addNoteFolder(
    gameId: string,
    noteFolder: NoteFolderDTO,
    folderId?: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (folderId) {
        setDoc(this.getNoteFolderDocumentRef(gameId, folderId), noteFolder)
          .then(() => {
            resolve(folderId);
          })
          .catch((error) => {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(
                error,
                `Note folder could not be added`,
              ),
            );
          });
      } else {
        addDoc(this.getNoteFolderCollectionRef(gameId), noteFolder)
          .then((doc) => {
            resolve(doc.id);
          })
          .catch((error) => {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(
                error,
                `Note folder could not be added`,
              ),
            );
          });
      }
    });
  }

  public static updateNoteFolder(
    gameId: string,
    folderId: string,
    updatedNoteFolder: PartialNoteFolderDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      updateDoc(
        this.getNoteFolderDocumentRef(gameId, folderId),
        updatedNoteFolder,
      )
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Note folder could not be updated`,
            ),
          );
        });
    });
  }
  public static deleteNoteFolder(
    gameId: string,
    folderId: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      deleteDoc(this.getNoteFolderDocumentRef(gameId, folderId))
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              `Note folder could not be deleted`,
            ),
          );
        });
    });
  }
}
