import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useTranslation } from "react-i18next";

import { useGameId } from "pages/games/gamePageLayout/hooks/useGameId";

import { useNotesStore } from "stores/notes.store";

export interface FolderDeleteButtonProps {
  name: string;
  folderId: string;
  parentFolderId: string;
}

export function FolderDeleteButton(props: FolderDeleteButtonProps) {
  const { name, folderId, parentFolderId } = props;
  const { t } = useTranslation();
  const confirm = useConfirm();

  const campaignId = useGameId();

  const setOpenFolder = useNotesStore((store) => store.setOpenItem);
  const deleteFolder = useNotesStore((store) => store.deleteFolder);

  const deleteCurrentFolder = () => {
    confirm({
      title: t("notes.confirm-folder-delete-title", "Delete {{folderName}}", {
        folderName: name,
      }),
      description: t(
        "notes.confirm.folder-delete.description",
        "Are you sure you want to delete this folder? This will also delete ALL notes and folders below this one.",
      ),
      confirmationText: t("common.delete", "Delete"),
    })
      .then(() => {
        setOpenFolder("folder", parentFolderId);
        deleteFolder(campaignId, folderId).catch(() => {});
      })
      .catch(() => {});
  };

  return (
    <Tooltip title={t("notes.toolbar.delete-folder", "Delete Folder")}>
      <IconButton onClick={deleteCurrentFolder}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
}
