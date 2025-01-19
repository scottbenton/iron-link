import {
  ExpansionConfig,
  GameRepository,
  RulesetConfig,
} from "repositories/game.repository";
import { WorldDTO, WorldRepository } from "repositories/worlds.repository";

import { GamePlayerRole } from "./game.service";

export interface IMinimalWorld {
  id: string;
  name: string;
}
export interface IWorld {
  id: string;
  name: string;

  settingKey: string | null;
  rulesets: RulesetConfig;
  expansions: ExpansionConfig;
  createdBy: string | null;
  createdAt: Date;

  description: Uint8Array;
}

export class WorldsService {
  public static async getUsersWorlds(userId: string): Promise<IMinimalWorld[]> {
    const games = await GameRepository.getUsersGames(
      userId,
      GamePlayerRole.Guide,
    );
    const worldIds = new Set<string>();
    games.forEach((game) => {
      if (game.world_id) {
        worldIds.add(game.world_id);
      }
    });

    const worlds = await WorldRepository.getUsersWorlds(
      userId,
      Array.from(worldIds),
    );
    return worlds.map((world) => ({
      id: world.id,
      name: world.name,
    }));
  }

  public static listenToWorld(
    uid: string,
    worldId: string,
    onUpdate: (world: IWorld) => void,
    onError: (error: Error) => void,
  ): () => void {
    return WorldRepository.listenToWorld(
      worldId,
      (world) => {
        onUpdate(this.convertWorldDTOToWorld(world));
      },
      onError,
    );
  }

  public static async createWorld(
    userId: string,
    name: string,
  ): Promise<string> {
    return WorldRepository.createWorld({
      name,
      created_by: userId,
    });
  }

  public static async updateWorldName(
    worldId: string,
    name: string,
  ): Promise<void> {
    return WorldRepository.updateWorld(worldId, {
      name,
    });
  }

  public static async updateWorldRulePackages(
    worldId: string,
    rulesets: RulesetConfig,
    expansions: ExpansionConfig,
    settingKey: string,
  ): Promise<void> {
    return WorldRepository.updateWorld(worldId, {
      rulesets,
      expansions,
      setting_key: settingKey,
    });
  }

  public static async updateWorldDescription(
    worldId: string,
    description: Uint8Array,
    descriptionText: string,
  ): Promise<void> {
    return WorldRepository.updateWorld(worldId, {
      description: this.uint8ArrayToDatabase(description),
      description_text: descriptionText,
    });
  }

  private static uint8ArrayToDatabase(arr: Uint8Array): string {
    return "\\x" + Buffer.from(arr).toString("hex");
  }
  private static databaseToUint8Array(str: string): Uint8Array {
    return Buffer.from(str.slice(2), "hex");
  }

  private static convertWorldDTOToWorld(world: WorldDTO): IWorld {
    return {
      id: world.id,
      name: world.name,
      settingKey: world.setting_key,
      rulesets: world.rulesets as RulesetConfig,
      expansions: world.expansions as ExpansionConfig,
      createdBy: world.created_by,
      createdAt: new Date(world.created_at),
      description: world.description
        ? this.databaseToUint8Array(world.description)
        : new Uint8Array(),
    };
  }
}
