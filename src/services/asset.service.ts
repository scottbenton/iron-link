import { AssetDTO, AssetRepository } from "repositories/asset.repository";

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

  private static convertAssetDTOToAsset(assetDTO: AssetDTO): IAsset {
    return assetDTO;
  }
  private static convertAssetToAssetDTO(asset: IAsset): AssetDTO {
    return asset;
  }
}
