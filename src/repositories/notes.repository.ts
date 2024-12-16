import {
  CollectionReference,
  DocumentData,
  PartialWithFieldValue,
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

export interface NoteDTO {
  title: string;
  order: number;

  creator: string;

  parentFolderId: string;

  // Permission sets can be null - we query folders first.
  readPermissions: ReadPermissions | null;
  editPermissions: EditPermissions | null;
}

export type PartialNoteDTO = PartialWithFieldValue<NoteDTO>;

export class NotesRepository {
  public static collectionName = "notes";

  public static getNoteCollectionName(gameId: string): string {
    return `${GameRepostiory.collectionName}/${gameId}/${this.collectionName}`;
  }
  private static getNoteCollectionRef(gameId: string) {
    return collection(
      firestore,
      this.getNoteCollectionName(gameId),
    ) as CollectionReference<NoteDTO>;
  }
  private static getNoteDocumentRef(gameId: string, noteId: string) {
    return doc(this.getNoteCollectionRef(gameId), noteId);
  }

  public static listenToNotes(
    uid: string | undefined,
    gameId: string,
    permissions: GamePermission,
    accessibleParentNoteFolderIds: string[],
    onNoteChanges: (
      changedNotes: Record<string, NoteDTO>,
      removedNoteIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    const parentNoteFolderQuery =
      accessibleParentNoteFolderIds.length > 0
        ? [
            and(
              where("readPermissions", "==", null),
              where("parentFolderId", "in", accessibleParentNoteFolderIds),
            ),
          ]
        : [];

    let noteQuery: Query<NoteDTO, DocumentData> = query(
      this.getNoteCollectionRef(gameId),
      or(
        where("readPermissions", "==", ReadPermissions.Public),
        ...parentNoteFolderQuery,
      ),
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
      ...parentNoteFolderQuery,
    ];
    if (permissions === GamePermission.Player) {
      noteQuery = query(
        this.getNoteCollectionRef(gameId),
        or(
          ...basePlayerPermissions,
          and(
            where("readPermissions", "==", ReadPermissions.GuidesAndAuthor),
            where("readPermissions.players", "array-contains", uid),
          ),
        ),
      );
    } else if (permissions === GamePermission.Guide) {
      noteQuery = query(
        this.getNoteCollectionRef(gameId),
        or(
          ...basePlayerPermissions,
          where("readPermissions", "==", ReadPermissions.OnlyGuides),
          where("readPermissions", "==", ReadPermissions.GuidesAndAuthor),
        ),
      );
    }

    return onSnapshot(
      noteQuery,
      (snapshot: QuerySnapshot<NoteDTO>) => {
        const changedNotes: Record<string, NoteDTO> = {};
        const deletedNoteIds: string[] = [];

        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            changedNotes[change.doc.id] = change.doc.data() as NoteDTO;
          } else if (change.type === "removed") {
            deletedNoteIds.push(change.doc.id);
          }
        });
        onNoteChanges(changedNotes, deletedNoteIds);
      },
      (error) => {
        console.debug(error);
        onError(
          convertUnknownErrorToStorageError(error, `Error listening to notes`),
        );
      },
    );
  }

  public static addNote(
    uid: string,
    gameId: string,
    parentFolderId: string,
    order: number,
    title: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const newNote: NoteDTO = {
        order,
        creator: uid,
        title,
        parentFolderId: parentFolderId,
        readPermissions: null,
        editPermissions: null,
      };

      addDoc(this.getNoteCollectionRef(gameId), newNote)
        .then((doc) => {
          resolve(doc.id);
        })
        .catch((e) => {
          console.error(e);
          reject(convertUnknownErrorToStorageError(e, `Failed to add note`));
        });
    });
  }

  public static updateNote(
    gameId: string,
    noteId: string,
    updatedNote: PartialNoteDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      updateDoc(this.getNoteDocumentRef(gameId, noteId), updatedNote)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          console.error(e);
          reject(convertUnknownErrorToStorageError(e, `Failed to update note`));
        });
    });
  }

  public static deleteNote(gameId: string, noteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      deleteDoc(this.getNoteDocumentRef(gameId, noteId))
        .then(() => {
          resolve();
        })
        .catch((e) => {
          console.error(e);
          reject(convertUnknownErrorToStorageError(e, `Failed to delete note`));
        });
    });
  }
}
