import { TFunction } from "i18next";

import { FAKE_ROOT_NOTE_FOLDER_KEY } from "./rootNodeName";

export function getItemName(params: {
  name: string | undefined;
  id: string;
  isRootPlayerFolder: boolean;
  t: TFunction;
}): string {
  const { name, id, t, isRootPlayerFolder } = params;

  if (isRootPlayerFolder) {
    return t("notes.user-folder", "Your Notes");
  } else if (id === FAKE_ROOT_NOTE_FOLDER_KEY) {
    return t("notes.root-folder", "Notes");
  }

  return name ?? t("notes.default-folder-name", "Folder");
}
