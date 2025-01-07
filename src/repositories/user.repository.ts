import { Tables, TablesUpdate } from "types/supabase-generated.type";

import { supabase } from "lib/supabase.lib";

import { convertUnknownErrorToStorageError } from "./errors/storageErrors";

export type UserDTO = Tables<"users">;
type UpdateUserDTO = TablesUpdate<"users">;

export class UserRepository {
  private static users = () => supabase.from("users");

  public static async getUser(userId: string): Promise<UserDTO> {
    return new Promise<UserDTO>((resolve, reject) => {
      this.users()
        .select()
        .eq("id", userId)
        .single()
        .then((response) => {
          if (response.error) {
            console.error(response.error);
            reject(
              convertUnknownErrorToStorageError(
                response.error,
                "Failed to get user",
              ),
            );
          } else {
            resolve(response.data);
          }
        });
    });
  }

  public static async updateUser(
    uid: string,
    user: UpdateUserDTO,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.users()
        .update(user)
        .eq("id", uid)
        .then((response) => {
          if (response.error) {
            console.error(response.error);
            reject(
              convertUnknownErrorToStorageError(
                response.error,
                "Failed to update user",
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }
}
