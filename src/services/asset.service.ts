import { CharacterOrGameId } from "types/CharacterOrGameId.type";

import { AssetDTO, AssetRepository } from "repositories/asset.repository";
import { StorageError } from "repositories/errors/storageErrors";

export type IAsset = AssetDTO;

export class AssetService {
  public static async createCharacterAsset(
    characterId: string,
    asset: IAsset,
  ): Promise<string> {
    return AssetRepository.createCharacterAsset(
      characterId,
      this.convertAssetToAssetDTO(asset),
    );
  }
  public static async createGameAsset(
    gameId: string,
    asset: IAsset,
  ): Promise<string> {
    return AssetRepository.createGameAsset(
      gameId,
      this.convertAssetToAssetDTO(asset),
    );
  }

  public static listenToGameAssets(
    gameId: string,
    onAssets: (assets: Record<string, IAsset>) => void,
    onError: (error: StorageError) => void,
  ) {
    return AssetRepository.listenToGameAssets(
      gameId,
      (assets) => {
        onAssets(
          Object.fromEntries(
            Object.entries(assets).map(([id, asset]) => [
              id,
              this.convertAssetDTOToAsset(asset),
            ]),
          ),
        );
      },
      onError,
    );
  }

  public static listenToCharacterAssets(
    characterId: string,
    onAssets: (assets: Record<string, IAsset>) => void,
    onError: (error: StorageError) => void,
  ) {
    return AssetRepository.listenToCharacterAssets(
      characterId,
      (assets) => {
        onAssets(
          Object.fromEntries(
            Object.entries(assets).map(([id, asset]) => [
              id,
              this.convertAssetDTOToAsset(asset),
            ]),
          ),
        );
      },
      onError,
    );
  }

  public static async toggleAssetAbility(
    id: CharacterOrGameId,
    assetId: string,
    abilityIndex: number,
    checked: boolean,
  ) {
    if (id.type === "character") {
      return AssetRepository.updateCharacterAsset(id.characterId, assetId, {
        [`enabledAbilities.${abilityIndex}`]: checked,
      });
    } else {
      return AssetRepository.updateGameAsset(id.gameId, assetId, {
        [`enabledAbilities.${abilityIndex}`]: checked,
      });
    }
  }

  public static async updateAssetOption(
    id: CharacterOrGameId,
    assetId: string,
    assetOptionKey: string,
    value: string,
  ): Promise<void> {
    if (id.type === "character") {
      return AssetRepository.updateCharacterAsset(id.characterId, assetId, {
        [`optionValues.${assetOptionKey}`]: value,
      });
    } else {
      return AssetRepository.updateGameAsset(id.gameId, assetId, {
        [`optionValues.${assetOptionKey}`]: value,
      });
    }
  }

  public static async updateAssetControl(
    id: CharacterOrGameId,
    assetId: string,
    controlKey: string,
    controlValue: boolean | string | number,
  ): Promise<void> {
    if (id.type === "character") {
      return AssetRepository.updateCharacterAsset(id.characterId, assetId, {
        [`controlValues.${controlKey}`]: controlValue,
      });
    } else {
      return AssetRepository.updateGameAsset(id.gameId, assetId, {
        [`controlValues.${controlKey}`]: controlValue,
      });
    }
  }

  public static async deleteAsset(
    id: CharacterOrGameId,
    assetId: string,
  ): Promise<void> {
    if (id.type === "character") {
      return AssetRepository.removeCharacterAsset(id.characterId, assetId);
    } else {
      return AssetRepository.removeGameAsset(id.gameId, assetId);
    }
  }

  private static convertAssetDTOToAsset(assetDTO: AssetDTO): IAsset {
    return assetDTO;
  }
  private static convertAssetToAssetDTO(asset: IAsset): AssetDTO {
    return asset;
  }
}
