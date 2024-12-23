import { arrayRemove, arrayUnion } from "firebase/firestore";

import {
  ExpansionConfig,
  LegacyGameDTO,
  GameRepostiory,
  GameType,
  RulesetConfig,
  GameDTO,
  GamePlayerDTO,
} from "repositories/game.repository";
import { ColorScheme, SpecialTrack } from "repositories/shared.types";


export type IGame = {
  id: string;
  name: string;
  worldId: string | null;
  conditionMeters: Record<string, number>;
  specialTracks: Record<string, SpecialTrack>;
  gameType: GameType;
  colorScheme: ColorScheme | null;

  rulesets: RulesetConfig;
  expansions: ExpansionConfig;
};

export enum GamePlayerRole {
  Player = "player",
  Guide = "guide",
}

export interface IGamePlayer extends GamePlayerDTO {
  role: GamePlayerRole;
}

export class GameService {
  public static async createGame(
    uid: string,
    gameName: string,
    gameType: GameType,
    rulesets: Record<string, boolean>,
    expansions: Record<string, Record<string, boolean>>,
  ): Promise<string> {

    const gameDTO: LegacyGameDTO = {
      name: gameName,
      playerIds: [uid],
      worldId: null,
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

  public static async getGameInviteInfo(gameId: string, userId: string): Promise<{
    name: string,
    gameType: GameType,
    isPlayer: boolean,
  }> {
    const result = await GameRepostiory.getGameInviteInfo(gameId, userId);

    let gameType: GameType = GameType.Solo;
    if (result.game_type === 'co-op') {
      gameType = GameType.Coop;
    } else if (result.game_type === 'guided') {
      gameType = GameType.Guided;
    }

    return {
      name: result.name,
      gameType,
      isPlayer: result.isPlayer
    };
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

  public static async getUsersGames(uid: string): Promise<Record<string, IGame>> {
    const games = await GameRepostiory.getUsersGames(uid);
    return Object.fromEntries(
      games.map((gameDTO) => [
        gameDTO.id,
        this.convertGameDTOToGame(gameDTO),
      ]),
    );
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

  private static convertLegacyGameDTOToGame(id: string, gameDTO: LegacyGameDTO): IGame {
    return {id, ...gameDTO};
  }

  private static convertGameDTOToGame(gameDTO: GameDTO): IGame {
    let gameType = GameType.Solo;
    if (gameDTO.game_type === 'co-op') {
      gameType = GameType.Coop;
    } else if (gameDTO.game_type === 'guided') {
      gameType = GameType.Guided;
    }

    let colorScheme: ColorScheme | null = null;
    if (gameDTO.color_scheme === ColorScheme.Cinder) {
      colorScheme = ColorScheme.Cinder;
    } else if (gameDTO.color_scheme === ColorScheme.Eidolon) {
      colorScheme = ColorScheme.Eidolon;
    } else if (gameDTO.color_scheme === ColorScheme.Hinterlands) {
      colorScheme = ColorScheme.Hinterlands;
    } else if (gameDTO.color_scheme === ColorScheme.Myriad) {
      colorScheme = ColorScheme.Myriad;
    } else if (gameDTO.color_scheme === ColorScheme.Mystic) {
      colorScheme = ColorScheme.Mystic;
    } 

    return {
      id: gameDTO.id,
      name: gameDTO.name,
      worldId: null,
      conditionMeters: (gameDTO.condition_meter_values ?? {}) as Record<string, number>,
      specialTracks: (gameDTO.special_track_values ?? {}) as unknown as Record<string, SpecialTrack>,
      gameType,
      colorScheme,
      rulesets: gameDTO.rulesets as Record<string, boolean>,
      expansions: gameDTO.expansions as Record<string, Record<string, boolean>>,
    }
  }

  public static deleteGame(gameId: string): Promise<void> {
    return GameRepostiory.deleteGame(gameId);
  }
}
