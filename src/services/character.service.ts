import {
  CharacterDTO,
  CharacterRepository,
  InitiativeStatus,
} from "repositories/character.repository";

import { AssetService, IAsset } from "./asset.service";
import { GameService } from "./game.service";

export type ICharacter = CharacterDTO;

export class CharacterService {
  public static async getCharacter(characterId: string): Promise<ICharacter> {
    return CharacterService.convertCharacterDTOToCharacter(
      await CharacterRepository.getCharacter(characterId),
    );
  }

  private static convertCharacterDTOToCharacter(
    characterDTO: CharacterDTO,
  ): ICharacter {
    return characterDTO;
  }

  public static async getCharactersInGames(
    gameIds: string[],
  ): Promise<Record<string, ICharacter>> {
    return await CharacterRepository.getCharactersInGames(gameIds);
  }

  public static async getCharacterPortraitURL(
    characterId: string,
    filename: string,
  ): Promise<string> {
    return CharacterRepository.getCharacterImageLink(characterId, filename);
  }

  public static async createCharacterAndAddToGame(params: {
    uid: string;
    gameId: string;
    name: string;
    stats: Record<string, number>;
    profileImage: {
      image: File | null;
      position: {
        x: number;
        y: number;
      };
      scale: number;
    };
    characterAssets: IAsset[];
    gameAssets: IAsset[];
  }): Promise<string> {
    const {
      uid,
      gameId,
      name,
      stats,
      profileImage,
      characterAssets,
      gameAssets,
    } = params;

    const character: CharacterDTO = {
      uid,
      name,
      stats,
      conditionMeters: {},
      specialTracks: {},
      momentum: 0,
      gameId,
      profileImage: profileImage.image
        ? {
            filename: profileImage.image.name,
            position: profileImage.position,
            scale: profileImage.scale,
          }
        : null,
      unspentExperience: 0,
      colorScheme: null,
      initiativeStatus: InitiativeStatus.OutOfCombat,
      debilities: {},
      adds: 0,
    };

    const assetPromises: Promise<unknown>[] = [];

    const characterId = await CharacterRepository.createCharacter(character);
    if (profileImage.image) {
      try {
        CharacterRepository.uploadCharacterImage(
          characterId,
          profileImage.image,
        );
      } catch (e) {
        console.error("Failed to upload portrait:", e);
      }
    }

    characterAssets.forEach((asset) => {
      assetPromises.push(AssetService.createCharacterAsset(characterId, asset));
    });

    await GameService.addCharacterToGame(gameId, uid, characterId);
    gameAssets.forEach((asset) => {
      assetPromises.push(AssetService.createGameAsset(gameId, asset));
    });

    await Promise.all(assetPromises);

    // Assets

    return characterId;
  }
}
