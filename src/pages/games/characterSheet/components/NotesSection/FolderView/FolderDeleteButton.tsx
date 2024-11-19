import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useConfirm } from "material-ui-confirm";

import { useFolderDescendants } from "./useFolderDescendants";
import { removeNoteFolderTransaction } from "api-calls/notes/removeNoteFolderTransaction";
import { useSetOpenItem } from "pages/games/gamePageLayout/atoms/notes.atom";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";

export interface FolderDeleteButtonProps {
  name: string;
  folderId: string;
  parentFolderId: string;
}

export function FolderDeleteButton(props: FolderDeleteButtonProps) {
  const { name, folderId, parentFolderId } = props;
  const { t } = useTranslation();
  const confirm = useConfirm();

  const campaignId = useCampaignId();
  const descendants = useFolderDescendants(folderId);

  const setOpenFolder = useSetOpenItem();

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
        setOpenFolder({
          type: "folder",
          folderId: parentFolderId,
        });
        removeNoteFolderTransaction({
          campaignId,
          folderIds: Object.keys(descendants.folders),
          noteIds: Object.keys(descendants.notes),
        });
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
