import {
  CharacterDTO,
  CharacterRepository,
  InitiativeStatus,
} from "repositories/character.repository";
import { StorageError } from "repositories/errors/storageErrors";
import { ColorScheme } from "repositories/shared.types";

import { AssetService, IAsset } from "./asset.service";

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

  public static listenToGameCharacters(
    gameId: string,
    onCharacterChanges: (
      changedCharacters: Record<string, ICharacter>,
      removedCharacterIds: string[],
    ) => void,
    onError: (error: StorageError) => void,
  ): () => void {
    return CharacterRepository.listenToGameCharacters(
      gameId,
      onCharacterChanges,
      onError,
    );
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

    gameAssets.forEach((asset) => {
      assetPromises.push(AssetService.createGameAsset(gameId, asset));
    });

    await Promise.all(assetPromises);

    // Assets

    return characterId;
  }

  public static async removeCharacterPortrait(
    characterId: string,
    filename: string,
  ): Promise<void> {
    const promises: Promise<unknown>[] = [];
    promises.push(
      CharacterRepository.updateCharacter(characterId, { profileImage: null }),
    );
    promises.push(
      CharacterRepository.deleteCharacterPortrait(characterId, filename),
    );
    await Promise.all(promises);
  }

  public static async updateCharacterName(characterId: string, name: string) {
    return CharacterRepository.updateCharacter(characterId, { name });
  }

  public static async updateCharacterPortrait(
    characterId: string,
    scale: number,
    position: { x: number; y: number },
    oldFilename?: string,
    newPortrait?: File,
  ) {
    const promises: Promise<unknown>[] = [];
    if (oldFilename) {
      promises.push(
        CharacterRepository.deleteCharacterPortrait(characterId, oldFilename),
      );
    }
    if (newPortrait) {
      promises.push(
        CharacterRepository.uploadCharacterImage(characterId, newPortrait),
      );
    }

    promises.push(
      CharacterRepository.updateCharacter(
        characterId,
        newPortrait
          ? {
              profileImage: {
                filename: newPortrait.name,
                scale,
                position,
              },
            }
          : {
              profileImage: {
                scale,
                position,
                filename: oldFilename,
              },
            },
      ),
    );
    await Promise.all(promises);
  }

  public static async updateCharacterStats(
    characterId: string,
    stats: Record<string, number>,
  ) {
    return CharacterRepository.updateCharacter(characterId, { stats });
  }

  public static async updateCharacterColorScheme(
    characterId: string,
    colorScheme: ColorScheme | null,
  ) {
    return CharacterRepository.updateCharacter(characterId, { colorScheme });
  }

  public static async updateCharacterInitiativeStatus(
    characterId: string,
    initiativeStatus: InitiativeStatus,
  ) {
    return CharacterRepository.updateCharacter(characterId, {
      initiativeStatus,
    });
  }

  public static async updateAdds(
    characterId: string,
    adds: number,
  ): Promise<void> {
    return CharacterRepository.updateCharacter(characterId, { adds });
  }

  public static updateConditionMeter(
    characterId: string,
    conditionMeterKey: string,
    value: number,
  ): Promise<void> {
    return CharacterRepository.updateCharacter(characterId, {
      [`conditionMeters.${conditionMeterKey}`]: value,
    });
  }

  public static updateMomentum(
    characterId: string,
    momentum: number,
  ): Promise<void> {
    return CharacterRepository.updateCharacter(characterId, { momentum });
  }

  public static updateImpact(
    characterId: string,
    impactKey: string,
    checked: boolean,
  ): Promise<void> {
    return CharacterRepository.updateCharacter(characterId, {
      [`debilities.${impactKey}`]: checked,
    });
  }

  public static updateSpecialTrackValue(
    characterId: string,
    trackKey: string,
    value: number,
  ): Promise<void> {
    return CharacterRepository.updateCharacter(characterId, {
      [`specialTracks.${trackKey}.value`]: value,
    });
  }

  public static updateExperience(
    characterId: string,
    experience: number,
  ): Promise<void> {
    return CharacterRepository.updateCharacter(characterId, {
      unspentExperience: experience,
    });
  }

  public static async deleteCharacter(characterId: string): Promise<void> {
    return CharacterRepository.deleteCharacter(characterId);
  }
}
