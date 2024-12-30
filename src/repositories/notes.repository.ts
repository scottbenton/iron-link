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

import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "types/supabase-generated.type";

import { GamePermission } from "stores/game.store";

import { firestore } from "config/firebase.config";

import { supabase } from "lib/supabase.lib";

import {
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";
import { GameRepostiory } from "./game.repository";
import { EditPermissions, ReadPermissions } from "./shared.types";

export type NoteDTO = Tables<"notes">;
type NoteInsertDTO = TablesInsert<"notes">;
type NoteUpdateDTO = TablesUpdate<"notes">;

export type PartialNoteDTO = PartialWithFieldValue<NoteDTO>;

export class NotesRepository {
  private static notes = () => supabase.from("notes");

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
    const query = this.notes()
      .select(
        `
        id,
        author_id,
        parent_folder_id,
        title,
        read_permissions,
        note_edit_permissions,
        created_at,
        note_folders(
          game_id
        )
        `,
      )
      .eq("");
    // Todo - make sure parentFolderGameId is equal to game ID and then go through the same permission checks as in noteFolders

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
