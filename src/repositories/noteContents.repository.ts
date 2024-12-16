import {
  Bytes,
  CollectionReference,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { firestore } from "config/firebase.config";

import {
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";
import { NotesRepository } from "./notes.repository";

export interface NoteContentDTO {
  notes?: Bytes; // Can be converted out to JSON or HTML - see DatabaseStructure.md
}

export class NoteContentsRepository {
  private static collectionName = "note-contents";
  private static documentName = "contents";

  private static getNoteContentCollectionName(
    gameId: string,
    noteId: string,
  ): string {
    return `${NotesRepository.getNoteCollectionName(gameId)}/${noteId}/${this.collectionName}`;
  }
  private static getNoteContentCollectionRef(gameId: string, noteId: string) {
    return collection(
      firestore,
      this.getNoteContentCollectionName(gameId, noteId),
    ) as CollectionReference<NoteContentDTO>;
  }
  private static getNoteContentDocumentRef(gameId: string, noteId: string) {
    return doc(
      this.getNoteContentCollectionRef(gameId, noteId),
      this.documentName,
    );
  }

  public static listenToNoteContent(
    gameId: string,
    noteId: string,
    onNoteContentChange: (noteContent: NoteContentDTO) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return onSnapshot(
      this.getNoteContentDocumentRef(gameId, noteId),
      (doc) => {
        if (doc.exists()) {
          onNoteContentChange(doc.data() as NoteContentDTO);
        } else {
          onNoteContentChange({});
        }
      },
      (error) => {
        console.error(error);
        onError(
          convertUnknownErrorToStorageError(
            error,
            "Failed to listen to note content",
          ),
        );
      },
    );
  }

  public static async updateNoteContent(
    gameId: string,
    noteId: string,
    noteContent: NoteContentDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      setDoc(this.getNoteContentDocumentRef(gameId, noteId), noteContent)
        .then(resolve)
        .catch((error) => {
          console.error(error);
          reject(
            convertUnknownErrorToStorageError(
              error,
              "Failed to update note content",
            ),
          );
        });
    });
  }
}
