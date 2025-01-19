import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "types/supabase-generated.type";

import { supabase } from "lib/supabase.lib";

import {
  StorageError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";

export type MinimalWorldDTO = Pick<WorldDTO, "id" | "name">;
export type WorldDTO = Tables<"worlds">;
type InsertWorldDTO = TablesInsert<"worlds">;
type UpdateWorldDTO = TablesUpdate<"worlds">;

export class WorldRepository {
  private static worlds = () => supabase.from("worlds");

  public static getUsersWorlds(
    uid: string,
    worldIds: string[],
  ): Promise<MinimalWorldDTO[]> {
    return new Promise((resolve, reject) => {
      this.worlds()
        .select("id, name")
        .or(`created_by.eq.${uid},id.in.(${worldIds.join(",")})`)
        .then((result) => {
          if (result.error) {
            console.error(result.error);
            reject(
              convertUnknownErrorToStorageError(
                result.error,
                "Failed to get user's worlds",
              ),
            );
          } else {
            resolve(result.data);
          }
        });
    });
  }

  public static listenToWorld(
    worldId: string,
    onWorld: (world: WorldDTO) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    this.worlds()
      .select()
      .eq("id", worldId)
      .single()
      .then((result) => {
        if (result.error) {
          console.error(result.error);
          onError(
            convertUnknownErrorToStorageError(
              result.error,
              "Failed to listen to world",
            ),
          );
        } else {
          onWorld(result.data);
        }
      });

    const subscription = supabase
      .channel(`worlds:id=eq.${worldId}`)
      .on<WorldDTO>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "worlds",
          filter: `id=eq.${worldId}`,
        },
        (payload) => {
          if (payload.errors) {
            console.error(payload.errors);
            onError(
              convertUnknownErrorToStorageError(
                payload.errors,
                "Failed to listen to world",
              ),
            );
          } else if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            onWorld(payload.new);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  public static createWorld(world: InsertWorldDTO): Promise<string> {
    return new Promise((resolve, reject) => {
      this.worlds()
        .insert(world)
        .select("id")
        .single()
        .then((result) => {
          if (result.error) {
            console.error(result.error);
            reject(
              convertUnknownErrorToStorageError(
                result.error,
                "Failed to create world",
              ),
            );
          } else {
            resolve(result.data.id);
          }
        });
    });
  }

  public static updateWorld(
    worldId: string,
    world: UpdateWorldDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.worlds()
        .update(world)
        .eq("id", worldId)
        .then((result) => {
          if (result.error) {
            console.error(result.error);
            reject(
              convertUnknownErrorToStorageError(
                result.error,
                "Failed to update world",
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }

  public static deleteWorld(worldId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.worlds()
        .delete()
        .eq("id", worldId)
        .then((result) => {
          if (result.error) {
            console.error(result.error);
            reject(
              convertUnknownErrorToStorageError(
                result.error,
                "Failed to delete world",
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }
}
