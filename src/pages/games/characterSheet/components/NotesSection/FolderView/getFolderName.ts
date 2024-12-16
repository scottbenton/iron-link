import { TFunction } from "i18next";

import { GUIDE_NOTE_FOLDER_NAME } from "stores/notes.store";

import { GameType } from "repositories/game.repository";

import { FAKE_ROOT_NOTE_FOLDER_KEY } from "./rootNodeName";

export function getItemName(params: {
  name: string;
  id: string;
  uid: string | undefined;
  t: TFunction;
  gameType: GameType;
}): string {
  const { name, id, uid, t, gameType } = params;

  if (id === uid) {
    return t("notes.user-folder", "Your Notes");
  } else if (id === GUIDE_NOTE_FOLDER_NAME) {
    if (gameType === GameType.Coop) {
      return t("notes.guide-folder-coop-name", "Shared Notes");
    }
    return t("notes.guide-folder", "Guide Notes");
  } else if (id === FAKE_ROOT_NOTE_FOLDER_KEY) {
    return t("notes.root-folder", "Notes");
  }

  return name;
}
