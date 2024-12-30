import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "types/supabase-generated.type";

import { supabase } from "lib/supabase.lib";

import {
  StorageError,
  UnknownError,
  convertUnknownErrorToStorageError,
} from "./errors/storageErrors";

export type AssetDTO = Tables<"assets">;
type InsertAssetDTO = TablesInsert<"assets">;
type UpdateAssetDTO = TablesUpdate<"assets">;

export class AssetRepository {
  public static assets = () => supabase.from("assets");

  public static async createAsset(assetDTO: InsertAssetDTO): Promise<string> {
    const { data, error } = await this.assets()
      .insert(assetDTO)
      .select()
      .single();
    if (error) {
      console.error(error);
      throw convertUnknownErrorToStorageError(
        error,
        "Asset could not be created",
      );
    }
    return data.id;
  }

  public static listenToAssets(
    gameId: string,
    characterIds: string[],
    onAssets: (
      assets: Record<string, AssetDTO>,
      deletedAssetIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    // Fetch the initial state
    this.assets()
      .select()
      .or(
        `game_id.eq.${gameId}, character_id.in.("${characterIds.join('","')}")`,
      )
      .then((result) => {
        if (result.error) {
          console.error(result.error);
          onError(
            convertUnknownErrorToStorageError(
              result.error,
              "Failed to get initial assets",
            ),
          );
        } else {
          const assets: Record<string, AssetDTO> = {};
          result.data?.forEach((asset) => {
            assets[asset.id] = asset;
          });
          onAssets(assets, []);
        }
      });

    console.debug("LISTENING TO ASSETS", gameId);

    const handlePayload: (
      payload: RealtimePostgresChangesPayload<AssetDTO>,
    ) => void = (payload) => {
      if (payload.errors) {
        console.error(payload.errors);
        onError(new UnknownError("Failed to get asset changes"));
      }
      console.debug("GOT PAYLOAD", payload);
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        onAssets({ [payload.new.id]: payload.new }, []);
      } else if (payload.eventType === "DELETE" && payload.old.id) {
        onAssets({}, [payload.old.id]);
      } else {
        console.debug("Unknown event type", payload.eventType);
        onError(new UnknownError("Failed to get asset changes"));
      }
    };

    const subscription = supabase
      .channel(`assets:game_id=${gameId}`)
      .on<AssetDTO>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "assets",
          filter: `game_id=eq.${gameId}`,
        },
        handlePayload,
      )
      .on<AssetDTO>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "assets",
          filter: `character_id=in.(${characterIds.join(",")})`,
        },
        handlePayload,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }

  public static deleteAsset(assetId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.assets()
        .delete()
        .eq("id", assetId)
        .then(({ error }) => {
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(
                error,
                "Failed to delete asset",
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }

  public static updateAsset(
    assetId: string,
    assetDTO: UpdateAssetDTO,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.assets()
        .update(assetDTO)
        .eq("id", assetId)
        .then(({ error }) => {
          if (error) {
            console.error(error);
            reject(
              convertUnknownErrorToStorageError(
                error,
                "Failed to update asset",
              ),
            );
          } else {
            resolve();
          }
        });
    });
  }
}
