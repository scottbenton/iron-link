import { firebaseAuth } from "config/firebase.config";
import { deleteDoc } from "firebase/firestore";

import {
  constructCharacterPortraitFolderPath,
  getCharacterDoc,
} from "./_getRef";
import { deleteAllAssets } from "api-calls/assets/deleteAllAssets";
import { removeCharacterFromCampaign } from "api-calls/campaign/removeCharacterFromCampaign";
import { getCharacterSettingsDoc } from "api-calls/character-campaign-settings/_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteNotes } from "api-calls/notes/deleteNotes";
import { deleteImage } from "lib/storage.lib";

export const deleteCharacter = createApiFunction<
  {
    characterId: string;
    campaignId?: string;
    portraitFilename?: string;
  },
  void
>((params) => {
  return new Promise((resolve, reject) => {
    const { characterId, campaignId, portraitFilename } = params;

    let removeCharacterFromCampaignPromise: Promise<void> = Promise.resolve();
    if (campaignId) {
      removeCharacterFromCampaignPromise = removeCharacterFromCampaign({
        uid: firebaseAuth.currentUser?.uid ?? "",
        campaignId,
        characterId,
      });
    }

    removeCharacterFromCampaignPromise
      .then(() => {
        const promises: Promise<unknown>[] = [];

        if (portraitFilename) {
          promises.push(
            deleteImage(
              constructCharacterPortraitFolderPath(characterId),
              portraitFilename,
            ),
          );
        }

        promises.push(deleteNotes({ characterId }));
        promises.push(deleteDoc(getCharacterSettingsDoc(characterId)));
        promises.push(deleteAllAssets({ characterId }));

        Promise.all(promises)
          .then(() => {
            deleteDoc(getCharacterDoc(characterId))
              .then(() => {
                resolve();
              })
              .catch((e) => {
                reject(e);
                console.error(e);
              });
          })
          .catch((e) => {
            reject(e);
            console.error(e);
          });
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
}, "Failed to delete character.");
