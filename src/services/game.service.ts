import { arrayRemove, arrayUnion } from "firebase/firestore";

import {
  ExpansionConfig,
  GameDTO,
  GameRepostiory,
  GameType,
  RulesetConfig,
} from "repositories/game.repository";
import { ColorScheme } from "repositories/shared.types";

import { AuthService } from "./auth.service";

export type IGame = GameDTO;

export class GameService {
  public static async createGame(
    gameName: string,
    gameType: GameType,
    rulesets: Record<string, boolean>,
    expansions: Record<string, Record<string, boolean>>,
  ): Promise<string> {
    const uid = AuthService.getCurrentUserIdOrThrow();

    const gameDTO: GameDTO = {
      name: gameName,
      playerIds: [uid],
      worldId: null,
      characters: [],
      guideIds: [],
      conditionMeters: {},
      specialTracks: {},
      gameType: gameType,
      rulesets,
      expansions,
      colorScheme: null,
    };

    return GameRepostiory.createGame(gameDTO);
  }

  public static async getGame(gameId: string): Promise<IGame> {
    const gameDTO = await GameRepostiory.getGame(gameId);
    return this.convertGameDTOToGame(gameDTO);
  }

  public static listenToGame(
    gameId: string,
    onUpdate: (game: IGame) => void,
    onError: (error: Error) => void,
  ): () => void {
    return GameRepostiory.listenToGame(
      gameId,
      (gameDTO) => {
        onUpdate(this.convertGameDTOToGame(gameDTO));
      },
      onError,
    );
  }

  public static async getUsersGames(): Promise<Record<string, IGame>> {
    const uid = AuthService.getCurrentUserIdOrThrow();

    return await GameRepostiory.getUsersGames(uid);
  }

  public static async changeName(
    gameId: string,
    newName: string,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, { name: newName });
  }

  public static async addPlayer(
    gameId: string,
    playerId: string,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, {
      playerIds: arrayUnion(playerId),
    });
  }

  public static async removePlayer(
    gameId: string,
    playerId: string,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, {
      playerIds: arrayRemove(playerId),
    });
  }

  public static async addCharacter(
    gameId: string,
    uid: string,
    characterId: string,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, {
      characters: arrayUnion({ uid, characterId }),
    });
  }

  public static async removeCharacter(
    gameId: string,
    uid: string,
    characterId: string,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, {
      characters: arrayRemove({ uid, characterId }),
    });
  }

  public static async addGuide(gameId: string, guideId: string): Promise<void> {
    await GameRepostiory.updateGame(gameId, { guideIds: arrayUnion(guideId) });
  }

  public static async removeGuide(
    gameId: string,
    guideId: string,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, { guideIds: arrayRemove(guideId) });
  }

  public static async setWorldId(
    gameId: string,
    worldId: string | null,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, { worldId });
  }

  public static async updateConditionMeter(
    gameId: string,
    conditionMeterKey: string,
    value: number,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, {
      [`conditionMeters.${conditionMeterKey}`]: value,
    });
  }

  public static async updateSpecialTrackValue(
    gameId: string,
    trackKey: string,
    value: number,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, {
      [`specialTracks.${trackKey}.value`]: value,
    });
  }

  public static async changeGameType(gameId: string, gameType: GameType) {
    await GameRepostiory.updateGame(gameId, { gameType });
  }

  public static async updateRules(
    gameId: string,
    rulesets: RulesetConfig,
    expansions: ExpansionConfig,
  ): Promise<void> {
    await GameRepostiory.updateGame(gameId, { rulesets, expansions });
  }

  public static async updateColorScheme(
    gameId: string,
    colorScheme: ColorScheme,
  ) {
    await GameRepostiory.updateGame(gameId, { colorScheme });
  }

  public static addCharacterToGame(
    gameId: string,
    ownerId: string,
    characterId: string,
  ) {
    return GameRepostiory.addCharacterToGame(gameId, ownerId, characterId);
  }

  private static convertGameDTOToGame(gameDTO: GameDTO): IGame {
    return gameDTO;
  }
}
