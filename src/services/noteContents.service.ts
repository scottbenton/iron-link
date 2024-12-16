import { Bytes } from "firebase/firestore";

import { StorageError } from "repositories/errors/storageErrors";
import {
  NoteContentDTO,
  NoteContentsRepository,
} from "repositories/noteContents.repository";

export interface INoteContent {
  notes?: Uint8Array;
}

export class NoteContentsService {
  public static listenToNoteContent(
    gameId: string,
    noteId: string,
    onNoteContentChanged: (noteContent: INoteContent) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return NoteContentsRepository.listenToNoteContent(
      gameId,
      noteId,
      (noteContentDTO) => {
        onNoteContentChanged(
          this.convertNoteContentDTOToNoteContent(noteContentDTO),
        );
      },
      onError,
    );
  }

  public static async updateNoteContent(
    gameId: string,
    noteId: string,
    noteContent: Uint8Array,
    isBeaconRequest?: boolean,
  ): Promise<void> {
    console.debug("WAS BEACON REQUEST", isBeaconRequest);
    return NoteContentsRepository.updateNoteContent(
      gameId,
      noteId,
      this.convertNoteContentToNoteContentDTO({ notes: noteContent }),
    );
  }

  private static convertNoteContentToNoteContentDTO(
    noteContent: INoteContent,
  ): NoteContentDTO {
    return {
      notes: Bytes.fromUint8Array(noteContent.notes ?? new Uint8Array()),
    };
  }
  private static convertNoteContentDTOToNoteContent(
    noteContentDTO: NoteContentDTO,
  ): INoteContent {
    return {
      notes: noteContentDTO.notes?.toUint8Array(),
    };
  }
}
