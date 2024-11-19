import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

import { getItemName } from "./FolderView/getFolderName";
import { CampaignType } from "api-calls/campaign/_campaign.type";
import {
  EditPermissions,
  NoteFolder,
  ReadPermissions,
} from "api-calls/notes/_notes.type";
import { updateNoteFolder } from "api-calls/notes/updateNoteFolder";
import { updateNotePermissions } from "api-calls/notes/updateNotePermissions";
import { useUID } from "atoms/auth.atom";
import { DialogTitleWithCloseButton } from "components/DialogTitleWithCloseButton";
import { useCampaignId } from "pages/games/gamePageLayout/hooks/useCampaignId";
import { useCampaignPermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

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
    writePermissions: NoteFolder["editPermissions"];
    viewPermissions: NoteFolder["readPermissions"];
  };
  isInGMFolder: boolean;
  parentFolder: {
    id: string;
    name: string;
    writePermissions: NoteFolder["editPermissions"];
    viewPermissions: NoteFolder["readPermissions"];
  };
}

export function ShareButton(props: ShareButtonProps) {
  const { item, currentPermissions, isInGMFolder, parentFolder } = props;

  const { t } = useTranslation();
  const uid = useUID();
  const campaignId = useCampaignId();
  const campaignType = useCampaignPermissions().campaignType;

  const [open, setOpen] = useState(false);

  const { type, id, ownerId } = item;
  const { writePermissions, viewPermissions } = currentPermissions;

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
    setUpdatedViewPermissions({
      type,
      inherited: false,
    });

    // Update write permissions if they are more permissive than the new view permissions
    if (
      isEditPermissionMorePermissiveThanReadPermission(
        type,
        updatedWritePermissions.type,
      )
    ) {
      let newEditPermissions: EditPermissions;
      if (isInGMFolder) {
        newEditPermissions = EditPermissions.OnlyGuides;
      } else {
        newEditPermissions = EditPermissions.OnlyAuthor;
      }
      setUpdatedWritePermissions({
        type: newEditPermissions,
        inherited: false,
      });
    }
  };
  const handleSetEditPermissions = (type: EditPermissions) => {
    setUpdatedWritePermissions({
      type,
      inherited: false,
    });
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
      if (campaignType === CampaignType.Guided) {
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
    if (isInGMFolder && campaignType !== CampaignType.Solo) {
      options.push({
        label:
          campaignType === CampaignType.Coop
            ? t("notes.share-permissions.only-guides-coop", "All Players")
            : t("notes.share-permissions.only-guides", "Only Guide(s)"),
        value: ReadPermissions.OnlyGuides,
        disabled: false,
      });
    }
    if (
      (uid === ownerId || isInGMFolder) &&
      campaignType !== CampaignType.Solo &&
      (campaignType !== CampaignType.Coop || !isInGMFolder)
    ) {
      options.push({
        label: t("notes.share-permissions.all-players", "All Players"),
        value: ReadPermissions.AllPlayers,
        disabled: false,
      });
    }
    return options;
  }, [isInGMFolder, ownerId, t, uid, campaignType]);
  const writeOptions = useMemo<PermissionOption[]>(() => {
    const options: PermissionOption[] = [];

    if (uid === ownerId && !isInGMFolder) {
      options.push({
        label: t("notes.share-permissions.only-you", "Only You"),
        value: ReadPermissions.OnlyAuthor,
        disabled: false,
      });
      if (campaignType === CampaignType.Guided) {
        options.push({
          label: t(
            "notes.share-permissions.author-and-guides",
            "You and the Guide(s)",
          ),
          value: ReadPermissions.GuidesAndAuthor,
          disabled: updatedViewPermissions.type === ReadPermissions.OnlyAuthor,
        });
      }
    }
    if (isInGMFolder) {
      options.push({
        label:
          campaignType === CampaignType.Coop
            ? t("notes.share-permissions.only-guides-coop", "All Players")
            : t("notes.share-permissions.only-guides", "Only Guide(s)"),
        value: ReadPermissions.OnlyGuides,
        disabled: false,
      });
    }
    if (
      (uid === ownerId || isInGMFolder) &&
      campaignType !== CampaignType.Solo &&
      (campaignType !== CampaignType.Coop || !isInGMFolder)
    ) {
      options.push({
        label: t("notes.share-permissions.all-players", "All Players"),
        value: ReadPermissions.AllPlayers,
        disabled:
          updatedViewPermissions.type === ReadPermissions.OnlyAuthor ||
          updatedViewPermissions.type === ReadPermissions.OnlyGuides ||
          updatedViewPermissions.type === ReadPermissions.GuidesAndAuthor,
      });
    }
    return options;
  }, [isInGMFolder, ownerId, t, uid, updatedViewPermissions, campaignType]);

  const handleShare = () => {
    const finalizedReadPermissions =
      updatedViewPermissions.type === parentFolder.viewPermissions.type
        ? {
            type: parentFolder.viewPermissions.type,
            inherited: true,
          }
        : updatedViewPermissions;

    const finalizedWritePermissions =
      updatedWritePermissions.type === parentFolder.writePermissions.type
        ? {
            type: parentFolder.writePermissions.type,
            inherited: true,
          }
        : updatedWritePermissions;

    setOpen(false);

    if (type === "folder") {
      updateNoteFolder({
        campaignId,
        folderId: id,
        noteFolder: {
          readPermissions: finalizedReadPermissions,
          editPermissions: finalizedWritePermissions,
        },
      })
        .then(() => {})
        .catch(() => {});
    } else {
      updateNotePermissions({
        campaignId,
        noteId: id,
        readPermissions: finalizedReadPermissions,
        editPermissions: finalizedWritePermissions,
      })
        .then(() => {})
        .catch(() => {});
    }
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
              {updatedViewPermissions.inherited && (
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
                        campaignType,
                      }),
                    },
                  )}
                </Typography>
              )}
              <RadioGroup
                aria-labelledby="read-permissions"
                value={updatedViewPermissions.type}
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
              {updatedWritePermissions.inherited && (
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
                        campaignType,
                      }),
                    },
                  )}
                </Typography>
              )}
              <RadioGroup
                aria-labelledby="write-permissions"
                value={updatedWritePermissions.type}
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
