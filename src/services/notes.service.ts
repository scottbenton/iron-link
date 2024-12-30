import { GamePermission } from "stores/game.store";

import { StorageError } from "repositories/errors/storageErrors";
import { NotesRepository } from "repositories/notes.repository";
import { EditPermissions, ReadPermissions } from "repositories/shared.types";

export type INote = {
    title: string;
    order: number;
  
    creator: string;
  
    parentFolderId: string;
  
    // Permission sets can be null - we query folders first.
    readPermissions: ReadPermissions | null;
    editPermissions: EditPermissions | null;
};

export type INoteContent {
  content: Uint8Array;
  
}

export class NotesService {
  public static listenToGameNotes(
    uid: string | undefined,
    gameId: string,
    gamePermissions: GamePermission,
    accessibleParentNoteFolderIds: string[],
    onNoteChanges: (
      changedNotes: Record<string, INote>,
      removedNoteIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return NotesRepository.listenToNotes(
      uid,
      gameId,
      gamePermissions,
      accessibleParentNoteFolderIds,
      onNoteChanges,
      onError,
    );
  }

  public static addNote(
    uid: string,
    gameId: string,
    parentFolderId: string,
    title: string,
    order: number,
  ): Promise<string> {
    return NotesRepository.addNote(uid, gameId, parentFolderId, order, title);
  }

  public static updateNoteName(
    gameId: string,
    noteId: string,
    title: string,
  ): Promise<void> {
    return NotesRepository.updateNote(gameId, noteId, { title });
  }

  public static updateNotePermissions(
    gameId: string,
    noteId: string,
    readPermissions: ReadPermissions,
    editPermissions: EditPermissions,
  ): Promise<void> {
    return NotesRepository.updateNote(gameId, noteId, {
      readPermissions,
      editPermissions,
    });
  }

  public static updateNoteOrder(
    gameId: string,
    noteId: string,
    order: number,
  ): Promise<void> {
    return NotesRepository.updateNote(gameId, noteId, { order });
  }

  public static updateNoteParentFolder(
    gameId: string,
    noteId: string,
    parentFolderId: string,
    order: number,
  ): Promise<void> {
    return NotesRepository.updateNote(gameId, noteId, {
      parentFolderId,
      order,
    });
  }

  public static deleteNote(gameId: string, noteId: string): Promise<void> {
    return NotesRepository.deleteNote(gameId, noteId);
  }
}
