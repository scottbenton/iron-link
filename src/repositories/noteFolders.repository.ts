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

export type NoteFolderDTO = Tables<"note_folders">;
type NoteFolderInsertDTO = TablesInsert<"note_folders">;
type NoteFolderUpdateDTO = TablesUpdate<"note_folders">;

export type PartialNoteFolderDTO = Partial<NoteFolderDTO>;

export class NoteFoldersRepository {
  private static noteFolders = () => supabase.from("note_folders");

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
    // Fetch initial results
    const query = this.noteFolders().select().eq("game_id", gameId);

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

    const subscription = supabase
      .channel(`note_folders:game_id=${gameId},uid=${uid}`)
      .on<NoteFolderDTO>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "note_folders",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.errors) {
            onError(
              convertUnknownErrorToStorageError(
                payload.errors,
                `Error listening to note folders`,
              ),
            );
          } else {
            if (
              payload.eventType === "INSERT" ||
              payload.eventType === "UPDATE"
            ) {
              // Check permissions
              if (
                permissions === GamePermission.Viewer &&
                payload.new.read_permissions === "public"
              ) {
                onNoteFolderChanges({ [payload.new.id]: payload.new }, []);
              } else if (
                permissions === GamePermission.Player &&
                (payload.new.read_permissions === "public" ||
                  payload.new.read_permissions === "all_players" ||
                  (payload.new.read_permissions === "only_author" &&
                    payload.new.author_id === uid) ||
                  (payload.new.read_permissions === "guides_and_author" &&
                    payload.new.author_id === uid))
              ) {
                onNoteFolderChanges({ [payload.new.id]: payload.new }, []);
              } else if (
                permissions === GamePermission.Guide &&
                (payload.new.read_permissions === "public" ||
                  payload.new.read_permissions === "all_players" ||
                  payload.new.read_permissions === "only_guides" ||
                  (payload.new.read_permissions === "only_author" &&
                    payload.new.author_id === uid) ||
                  payload.new.read_permissions === "guides_and_author")
              ) {
                onNoteFolderChanges({ [payload.new.id]: payload.new }, []);
              }
            } else if (payload.eventType === "DELETE" && payload.old.id) {
              onNoteFolderChanges({}, [payload.old.id]);
            }
          }
        },
      );

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  public static addNoteFolder(
    noteFolder: NoteFolderInsertDTO,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.noteFolders()
        .insert(noteFolder)
        .select()
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(
                error,
                `Note folder could not be added`,
              ),
            );
          } else {
            resolve(data.id);
          }
        });
    });
  }

  public static updateNoteFolder(
    folderId: string,
    updatedNoteFolder: NoteFolderUpdateDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.noteFolders()
        .update(updatedNoteFolder)
        .eq("id", folderId)
        .then(({ error }) => {
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(
                error,
                `Note folder could not be updated`,
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }

  public static deleteNoteFolder(folderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.noteFolders()
        .delete()
        .eq("id", folderId)
        .then(({ error }) => {
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(
                error,
                `Note folder could not be deleted`,
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }
}
