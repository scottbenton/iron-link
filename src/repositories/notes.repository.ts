import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "types/supabase-generated.type";

import { GamePermission } from "stores/game.store";

import { supabase } from "lib/supabase.lib";

import {
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";

export type NoteDTO = Tables<"notes">;
type NoteInsertDTO = TablesInsert<"notes">;
type NoteUpdateDTO = TablesUpdate<"notes">;

export class NotesRepository {
  private static notes = () => supabase.from("notes");

  public static listenToNotes(
    uid: string | undefined,
    gameId: string,
    permissions: GamePermission,
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
        edit_permissions,
        created_at,
        order,
        note_folders(
          game_id
        )
        `,
      )
      .eq("note_folders.game_id", gameId);

    if (permissions === GamePermission.Viewer) {
      query.eq("read_permissions", "public");
    } else if (permissions === GamePermission.Player) {
      query.or(
        `read_permissions.eq."public",read_permissions.eq."all_players",and(read_permissions.eq."only_author",author_id.eq."${uid}"),and(read_permissions.eq."guides_and_author",author_id.eq."${uid}")`,
      );
    } else if (permissions === GamePermission.Guide) {
      query.or(
        `read_permissions.eq."public",read_permissions.eq."all_players",read_permissions.eq."only_guides",and(read_permissions.eq."only_author",author_id.eq."${uid}"),read_permissions.eq."guides_and_author"`,
      );
    }

    query.then((response) => {
      if (response.error) {
        console.error(response.error);
        onError(
          convertUnknownErrorToStorageError(
            response.error,
            `Failed to listen to notes`,
          ),
        );
      } else {
        onNoteChanges(
          Object.fromEntries(
            response.data.map((note) => [
              note.id,
              note as unknown as NoteDTO,
            ]) ?? [],
          ),
          [],
        );
      }
    });

    const subscription = supabase
      .channel(`notes:game_id=${gameId}`)
      .on<NoteDTO>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.errors) {
            onError(
              convertUnknownErrorToStorageError(
                payload.errors,
                `Error listening to notes`,
              ),
            );
          } else {
            if (
              payload.eventType === "INSERT" ||
              payload.eventType === "UPDATE"
            ) {
              if (
                permissions === GamePermission.Viewer &&
                payload.new.read_permissions === "public"
              ) {
                onNoteChanges(
                  {
                    [payload.new.id]: payload.new,
                  },
                  [],
                );
              } else if (
                permissions === GamePermission.Player &&
                (payload.new.read_permissions === "public" ||
                  payload.new.read_permissions === "all_players" ||
                  (payload.new.read_permissions === "only_author" &&
                    payload.new.author_id === uid) ||
                  (payload.new.read_permissions === "guides_and_author" &&
                    payload.new.author_id === uid))
              ) {
                onNoteChanges(
                  {
                    [payload.new.id]: payload.new,
                  },
                  [],
                );
              } else if (
                permissions === GamePermission.Guide &&
                (payload.new.read_permissions === "public" ||
                  payload.new.read_permissions === "all_players" ||
                  payload.new.read_permissions === "only_guides" ||
                  (payload.new.read_permissions === "only_author" &&
                    payload.new.author_id === uid) ||
                  payload.new.read_permissions === "guides_and_author")
              ) {
                onNoteChanges({ [payload.new.id]: payload.new }, []);
              }
            } else if (payload.eventType === "DELETE" && payload.old.id) {
              onNoteChanges({}, [payload.old.id]);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  public static listenToNoteContent(
    noteId: string,
    onNoteContentChange: (note: NoteDTO) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    this.notes()
      .select()
      .eq("id", noteId)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          onError(
            convertUnknownErrorToStorageError(
              error,
              `Failed to listen to note content`,
            ),
          );
        } else {
          onNoteContentChange(data[0]);
        }
      });

    const subscription = supabase
      .channel(`notes:id=${noteId}`)
      .on<NoteDTO>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `id=eq.${noteId}`,
        },
        (payload) => {
          if (payload.errors) {
            onError(
              convertUnknownErrorToStorageError(
                payload.errors,
                `Error listening to note content`,
              ),
            );
          } else if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            onNoteContentChange(payload.new);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  public static addNote(note: NoteInsertDTO): Promise<string> {
    return new Promise((resolve, reject) => {
      this.notes()
        .insert(note)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(error, `Failed to add note`),
            );
          } else {
            resolve(data.id);
          }
        });
    });
  }

  public static updateNote(
    noteId: string,
    updatedNote: NoteUpdateDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notes()
        .update(updatedNote)
        .eq("id", noteId)
        .then(({ error }) => {
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(error, `Failed to update note`),
            );
          } else {
            resolve();
          }
        });
    });
  }

  public static deleteNote(noteId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notes()
        .delete()
        .eq("id", noteId)
        .then(({ error }) => {
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(error, `Failed to delete note`),
            );
          } else {
            resolve();
          }
        });
    });
  }
}
