import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";

import { useGameId } from "pages/games/gamePageLayout/hooks/useGameId";
import { useGamePermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { useUID } from "stores/auth.store";
import { GamePermission } from "stores/game.store";
import { GUIDE_NOTE_FOLDER_NAME, useNotesStore } from "stores/notes.store";

import { EditPermissions } from "repositories/shared.types";

import { INoteFolder } from "services/noteFolders.service";

import { getItemName } from "../FolderView/getFolderName";
import { FAKE_ROOT_NOTE_FOLDER_KEY } from "../FolderView/rootNodeName";
import { useFolderDescendants } from "../FolderView/useFolderDescendants";
import { MoveTreeItem } from "./MoveTreeItem";

export interface MoveDialogProps {
  open: boolean;
  onClose: () => void;
  item: {
    type: "folder" | "note";
    id: string;
    parentFolderId: string;
  };
}

export function MoveDialog(props: MoveDialogProps) {
  const { open, onClose, item } = props;
  const { type, id, parentFolderId } = item;

  const { t } = useTranslation();

  const [selectedParentFolder, setSelectedParentFolder] = useState<
    string | null
  >(parentFolderId);
  const selectedParentFolderOrder = useNotesStore((store) => {
    let nextOrder = 0;
    Object.values(store.noteState.notes).forEach((note) => {
      if (note.parentFolderId === selectedParentFolder) {
        nextOrder = Math.max(nextOrder, note.order);
      }
    });
    return nextOrder;
  });

  const uid = useUID();
  const campaignId = useGameId();
  const { gameType, gamePermission: campaignPermission } = useGamePermissions();

  const descendants = useFolderDescendants(type === "folder" ? id : undefined);
  const [isMoveLoading, setIsMoveLoading] = useState(false);

  const isGuide = campaignPermission === GamePermission.Guide;

  const folders = useNotesStore((notes) => notes.folderState.folders);

  const { rootNodes, tree } = getTreeFromFolders(folders, uid, isGuide);

  const handleMove = useCallback(
    (newParentFolderId: string) => {
      const newFolder = folders[newParentFolderId];
      if (!newFolder || newParentFolderId === parentFolderId) {
        // We aren't moving the item, we're done!
        onClose();
        return;
      }
      setIsMoveLoading(true);
      const isCurrentNoteInGuideFolder = isFolderInGuideFolder(
        parentFolderId,
        folders,
      );
      const isNextFolderInGuideFolder = isFolderInGuideFolder(
        newParentFolderId,
        folders,
      );

      const promises: Promise<unknown>[] = [];

      if (isCurrentNoteInGuideFolder !== isNextFolderInGuideFolder) {
        // We will need to call update permissions as well as moving
        if (type === "note") {
          promises
            .push
            // updateNotePermissions({
            //   campaignId,
            //   noteId: id,
            //   readPermissions: null,
            //   editPermissions: null,
            // }),
            ();
        } else {
          // const folder = folders[id];
          // promises.push(
          //   updateNoteFolderPermissions({
          //     campaignId,
          //     folderId: id,
          //     currentPermissions: {
          //       readPermissions: folder.readPermissions,
          //       editPermissions: folder.editPermissions,
          //     },
          //     nextPermissions: {
          //       readPermissions: newFolder.readPermissions,
          //       editPermissions: newFolder.editPermissions,
          //     },
          //     descendantFolders: descendants.folders,
          //     descendantNotes: descendants.notes,
          //   }),
          // );
        }
      }
      // We can just move the item
      if (type === "note") {
        // Get the order to put the note last in the next list
        // promises.push(
        //   updateNote({
        //     campaignId,
        //     noteId: id,
        //     note: {
        //       parentFolderId: newParentFolderId,
        //       order: selectedParentFolderOrder + 1,
        //     },
        //   }),
        // );
      } else {
        // promises.push(
        //   updateNoteFolder({
        //     campaignId,
        //     folderId: id,
        //     noteFolder: {
        //       parentFolderId: newParentFolderId,
        //     },
        //   }),
        // );
      }

      Promise.all(promises)
        .catch(() => {})
        .finally(() => {
          setIsMoveLoading(false);
          onClose();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      type,
      id,
      parentFolderId,
      folders,
      descendants,
      campaignId,
      selectedParentFolderOrder,
    ],
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitleWithCloseButton onClose={onClose}>
        {type === "note"
          ? t("notes.moveNote", "Move Note")
          : t("notes.moveFolder", "Move Folder")}
      </DialogTitleWithCloseButton>
      <DialogContent>
        <Typography>
          {type === "note"
            ? t(
                "notes.moveNoteDescription",
                "Select the folder you want to move this note to. Note that this may update the permissions of the note to match the new folder.",
              )
            : t(
                "notes.moveFolderDescription",
                "Select the folder you want to move this folder to. Note that this may update the permissions of the folder (and its contents) to match the new folder.",
              )}
        </Typography>
        <SimpleTreeView
          disableSelection={isMoveLoading}
          sx={{ mt: 2 }}
          selectedItems={selectedParentFolder}
          onSelectedItemsChange={(_, itemId) => setSelectedParentFolder(itemId)}
        >
          {rootNodes.map((folderId) => (
            <TreeItem
              itemId={folderId}
              key={folderId}
              label={getItemName({
                name: folders[folderId].name,
                id: folderId,
                uid,
                gameType: gameType,
                t,
              })}
            >
              {tree[folderId]?.map((childId) => (
                <MoveTreeItem
                  key={childId}
                  folderId={childId}
                  folders={folders}
                  tree={tree}
                  currentFolderId={type === "folder" ? id : undefined}
                />
              ))}
            </TreeItem>
          ))}
        </SimpleTreeView>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {t("common.cancel", "Cancel")}
        </Button>
        <Button
          disabled={isMoveLoading || !selectedParentFolder}
          variant="contained"
          onClick={() =>
            selectedParentFolder && handleMove(selectedParentFolder)
          }
        >
          {t("common.save", "Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function getTreeFromFolders(
  folders: Record<string, INoteFolder>,
  uid: string | undefined,
  isGuide: boolean,
) {
  const rootNodes: string[] = [];
  const tree: Record<string, string[]> = {};
  // Check each folder for permissions
  Object.entries(folders).forEach(([folderId, folder]) => {
    if (folderId === FAKE_ROOT_NOTE_FOLDER_KEY) {
      return;
    }
    if (
      folder.editPermissions === EditPermissions.GuidesAndAuthor &&
      (!isGuide || folder.creator !== uid)
    ) {
      return;
    } else if (
      folder.editPermissions === EditPermissions.OnlyAuthor &&
      folder.creator !== uid
    ) {
      return;
    } else if (
      folder.editPermissions === EditPermissions.OnlyGuides &&
      !isGuide
    ) {
      return;
    }

    if (folder.parentFolderId && folders[folder.parentFolderId]) {
      if (!tree[folder.parentFolderId]) {
        tree[folder.parentFolderId] = [];
      }
      tree[folder.parentFolderId].push(folderId);
    } else {
      rootNodes.push(folderId);
    }
  });

  return {
    rootNodes,
    tree,
  };
}

function isFolderInGuideFolder(
  folderId: string,
  folders: Record<string, INoteFolder>,
) {
  let currentFolder = folders[folderId];
  while (currentFolder.parentFolderId) {
    currentFolder = folders[currentFolder.parentFolderId];
    if (currentFolder.parentFolderId === GUIDE_NOTE_FOLDER_NAME) {
      return true;
    }
  }
  return false;
}
