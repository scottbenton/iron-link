import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";

// import { useGameId } from "pages/games/gamePageLayout/hooks/useGameId";
import { useGamePermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { useUID } from "stores/auth.store";

import { GameType } from "repositories/game.repository";
import { EditPermissions, ReadPermissions } from "repositories/shared.types";

import { getItemName } from "./FolderView/getFolderName";

// import { useFolderDescendants } from "./FolderView/useFolderDescendants";

interface PermissionOption {
  label: string;
  value: string;
  disabled: boolean;
}

export interface ShareButtonProps {
  item: {
    type: "folder" | "note";
    id: string;
    ownerId: string;
  };
  currentPermissions: {
    editPermissions: EditPermissions;
    readPermissions: ReadPermissions;
  };
  isInGMFolder: boolean;
  parentFolder: {
    id: string;
    name: string;
    editPermissions: EditPermissions;
    readPermissions: ReadPermissions;
  };
}

export function ShareButton(props: ShareButtonProps) {
  const { item, currentPermissions, isInGMFolder, parentFolder } = props;

  const { t } = useTranslation();
  const uid = useUID();
  // const campaignId = useGameId();
  const gameType = useGamePermissions().gameType;

  const [open, setOpen] = useState(false);

  const { type, ownerId } = item;
  const {
    editPermissions: writePermissions,
    readPermissions: viewPermissions,
  } = currentPermissions;

  // const folderDescendants = useFolderDescendants(
  //   item.type === "folder" ? item.id : undefined,
  // );

  const [updatedViewPermissions, setUpdatedViewPermissions] =
    useState(viewPermissions);
  const [updatedWritePermissions, setUpdatedWritePermissions] =
    useState(writePermissions);

  useEffect(() => {
    if (open) {
      setUpdatedWritePermissions(writePermissions);
      setUpdatedViewPermissions(viewPermissions);
    }
  }, [writePermissions, viewPermissions, open]);

  const handleSetViewPermissions = (type: ReadPermissions) => {
    setUpdatedViewPermissions(type);

    // Update write permissions if they are more permissive than the new view permissions
    if (
      isEditPermissionMorePermissiveThanReadPermission(
        type,
        updatedWritePermissions,
      )
    ) {
      let newEditPermissions: EditPermissions;
      if (isInGMFolder) {
        newEditPermissions = EditPermissions.OnlyGuides;
      } else {
        newEditPermissions = EditPermissions.OnlyAuthor;
      }
      setUpdatedWritePermissions(newEditPermissions);
    }
  };
  const handleSetEditPermissions = (type: EditPermissions) => {
    setUpdatedWritePermissions(type);
  };

  // We need to ensure that write permissions are restricted to the read permissions
  const readOptions = useMemo<PermissionOption[]>(() => {
    const options: PermissionOption[] = [];

    if (uid === ownerId && !isInGMFolder) {
      options.push({
        label: t("notes.share-permissions.only-you", "Only You"),
        value: ReadPermissions.OnlyAuthor,
        disabled: false,
      });
      if (gameType === GameType.Guided) {
        options.push({
          label: t(
            "notes.share-permissions.author-and-guides",
            "You and the Guide(s)",
          ),
          value: ReadPermissions.GuidesAndAuthor,
          disabled: false,
        });
      }
    }
    if (isInGMFolder && gameType !== GameType.Solo) {
      options.push({
        label:
          gameType === GameType.Coop
            ? t("notes.share-permissions.only-guides-coop", "All Players")
            : t("notes.share-permissions.only-guides", "Only Guide(s)"),
        value: ReadPermissions.OnlyGuides,
        disabled: false,
      });
    }
    if (
      (uid === ownerId || isInGMFolder) &&
      gameType !== GameType.Solo &&
      (gameType !== GameType.Coop || !isInGMFolder)
    ) {
      options.push({
        label: t("notes.share-permissions.all-players", "All Players"),
        value: ReadPermissions.AllPlayers,
        disabled: false,
      });
    }
    return options;
  }, [isInGMFolder, ownerId, t, uid, gameType]);
  const writeOptions = useMemo<PermissionOption[]>(() => {
    const options: PermissionOption[] = [];

    if (uid === ownerId && !isInGMFolder) {
      options.push({
        label: t("notes.share-permissions.only-you", "Only You"),
        value: ReadPermissions.OnlyAuthor,
        disabled: false,
      });
      if (gameType === GameType.Guided) {
        options.push({
          label: t(
            "notes.share-permissions.author-and-guides",
            "You and the Guide(s)",
          ),
          value: ReadPermissions.GuidesAndAuthor,
          disabled: updatedViewPermissions === ReadPermissions.OnlyAuthor,
        });
      }
    }
    if (isInGMFolder) {
      options.push({
        label:
          gameType === GameType.Coop
            ? t("notes.share-permissions.only-guides-coop", "All Players")
            : t("notes.share-permissions.only-guides", "Only Guide(s)"),
        value: ReadPermissions.OnlyGuides,
        disabled: false,
      });
    }
    if (
      (uid === ownerId || isInGMFolder) &&
      gameType !== GameType.Solo &&
      (gameType !== GameType.Coop || !isInGMFolder)
    ) {
      options.push({
        label: t("notes.share-permissions.all-players", "All Players"),
        value: ReadPermissions.AllPlayers,
        disabled:
          updatedViewPermissions === ReadPermissions.OnlyAuthor ||
          updatedViewPermissions === ReadPermissions.OnlyGuides ||
          updatedViewPermissions === ReadPermissions.GuidesAndAuthor,
      });
    }
    return options;
  }, [isInGMFolder, ownerId, t, uid, updatedViewPermissions, gameType]);

  const handleShare = () => {
    setOpen(false);

    // if (type === "folder") {
    //   updateNoteFolderPermissions({
    //     campaignId,
    //     folderId: id,
    //     descendantFolders: folderDescendants.folders,
    //     descendantNotes: folderDescendants.notes,
    //     currentPermissions,
    //     nextPermissions: {
    //       readPermissions: updatedViewPermissions,
    //       editPermissions: updatedWritePermissions,
    //     },
    //   })
    //     .then(() => {})
    //     .catch(() => {});
    // } else {
    //   updateNotePermissions({
    //     campaignId,
    //     noteId: id,
    //     readPermissions: updatedViewPermissions,
    //     editPermissions: updatedWritePermissions,
    //   })
    //     .then(() => {})
    //     .catch(() => {});
    // }
  };

  return (
    <>
      {(readOptions.length > 1 || writeOptions.length > 1) && (
        <IconButton onClick={() => setOpen(true)}>
          <ShareIcon />
        </IconButton>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitleWithCloseButton onClose={() => setOpen(false)}>
          {type === "folder"
            ? t("notes.shareFolder", "Share Folder")
            : t("notes.share", "Share Note")}
        </DialogTitleWithCloseButton>
        <DialogContent>
          <Box>
            <FormControl>
              <FormLabel id="read-permissions">
                {t("notes.share-permissions.view", "Who can view?")}
              </FormLabel>
              {updatedViewPermissions === parentFolder.readPermissions && (
                <Typography variant={"body2"} color="text.secondary" mb={1}>
                  {t(
                    "notes.share-permissions.inherited",
                    "Inherited from {{parentFolderName}}",
                    {
                      parentFolderName: getItemName({
                        name: parentFolder.name,
                        id: parentFolder.id,
                        t,
                        uid,
                        gameType: gameType,
                      }),
                    },
                  )}
                </Typography>
              )}
              <RadioGroup
                aria-labelledby="read-permissions"
                value={updatedViewPermissions}
                onChange={(_, value) =>
                  handleSetViewPermissions(value as ReadPermissions)
                }
              >
                {readOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                    disabled={option.disabled}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <Box mt={3}>
            <FormControl>
              <FormLabel id="write-permissions">
                {t("notes.share-permissions.write", "Who can edit?")}
              </FormLabel>
              {updatedWritePermissions === parentFolder.editPermissions && (
                <Typography variant={"body2"} color="text.secondary" mb={1}>
                  {t(
                    "notes.share-permissions.inherited",
                    "Inherited from {{parentFolderName}}",
                    {
                      parentFolderName: getItemName({
                        name: parentFolder.name,
                        id: parentFolder.id,
                        t,
                        uid,
                        gameType: gameType,
                      }),
                    },
                  )}
                </Typography>
              )}
              <RadioGroup
                aria-labelledby="write-permissions"
                value={updatedWritePermissions}
                onChange={(_, value) =>
                  handleSetEditPermissions(value as EditPermissions)
                }
              >
                {writeOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                    disabled={option.disabled}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleShare} variant="contained">
            {t("common.save-changes", "Save Changes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function isEditPermissionMorePermissiveThanReadPermission(
  readPermission: ReadPermissions,
  editPermission: EditPermissions,
) {
  if (editPermission === EditPermissions.AllPlayers) {
    if (
      readPermission !== ReadPermissions.AllPlayers &&
      readPermission !== ReadPermissions.Public
    ) {
      return true;
    }
    return false;
  }
  if (editPermission === EditPermissions.GuidesAndAuthor) {
    if (readPermission === ReadPermissions.OnlyAuthor) {
      return true;
    }
    return false;
  }

  return false;
}
