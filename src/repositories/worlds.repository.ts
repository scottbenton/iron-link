import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "types/supabase-generated.type";

import { supabase } from "lib/supabase.lib";

import { convertUnknownErrorToStorageError } from "./errors/storageErrors";

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
