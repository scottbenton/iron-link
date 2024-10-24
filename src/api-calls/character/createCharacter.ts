import { addDoc } from "firebase/firestore";

import { AssetDocument } from "api-calls/assets/_asset.type";
import { getCharacterAssetCollection } from "api-calls/assets/_getRef";
import {
  CharacterDocument,
  StatsMap,
} from "api-calls/character/_character.type";
import { getCharacterCollection } from "api-calls/character/_getRef";
import { updateCharacterPortrait } from "api-calls/character/updateCharacterPortrait";
import { createApiFunction } from "api-calls/createApiFunction";
import { momentumTrack } from "data/defaultTracks";

export const createCharacter = createApiFunction<
  {
    uid: string;
    name: string;
    stats: StatsMap;
    assets: AssetDocument[];
    campaignId: string;
  },
  string
>((params) => {
  return new Promise((resolve, reject) => {
    const { uid, name, stats, assets, campaignId } = params;
    const character: CharacterDocument = {
      uid: uid,
      name: name,
      stats: stats,
      conditionMeters: {},
      specialTracks: {},
      momentum: momentumTrack.startingValue,
      campaignId,
    };

    addDoc(getCharacterCollection(), character)
      .then((doc) => {
        const id = doc.id;
        const assetPromises = assets.map((asset) =>
          addDoc(getCharacterAssetCollection(id), asset),
        );
        Promise.all(assetPromises)
          .then(() => {
            resolve(id);
          })
          .catch(() => {
            resolve(id);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}, "Failed to create your character");

export function createCharacterAndUploadPortrait(
  uid: string,
  name: string,
  stats: Record<string, number>,
  assets: AssetDocument[],
  portrait:
    | {
        image: File | string;
        scale: number;
        position: {
          x: number;
          y: number;
        };
      }
    | undefined,
  campaignId: string,
) {
  return new Promise<string>((resolve) => {
    createCharacter({
      uid,
      name,
      stats,
      assets,
      campaignId,
    }).then((characterId) => {
      if (portrait && portrait.image && typeof portrait.image !== "string") {
        updateCharacterPortrait({
          characterId,
          portrait: portrait.image,
          scale: portrait.scale,
          position: portrait.position,
        })
          .then(() => {
            resolve(characterId);
          })
          .catch(() => {
            resolve(characterId);
          });
      } else {
        resolve(characterId);
      }
    });
  });
}
