import FolderIcon from "@mui/icons-material/Folder";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useCampaignPermissions } from "pages/games/gamePageLayout/hooks/usePermissions";

import { NoteFolder, ReadPermissions } from "api-calls/notes/_notes.type";

import { useUID } from "atoms/auth.atom";

import { FolderActionMenu } from "./FolderActionMenu";
import { getItemName } from "./getFolderName";

export interface FolderItemProps {
  folderId: string;
  folder: NoteFolder;
  openFolder: (details: { type: "folder"; folderId: string }) => void;
}

export function FolderItem(props: FolderItemProps) {
  const { folderId, folder, openFolder } = props;

  const { t } = useTranslation();

  const uid = useUID();
  const campaignType = useCampaignPermissions().campaignType;

  return (
    <Card
      variant={"outlined"}
      key={folderId}
      sx={{ bgcolor: "background.default", position: "relative" }}
    >
      <CardActionArea
        sx={{
          py: 1.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
        }}
        onClick={() => openFolder({ type: "folder", folderId: folderId })}
      >
        {folder.readPermissions !== ReadPermissions.OnlyAuthor ? (
          <FolderSharedIcon color="action" />
        ) : (
          <FolderIcon color="action" />
        )}
        <Typography sx={{ flexGrow: 1 }}>
          {getItemName({
            name: folder.name,
            id: folderId,
            uid,
            t,
            campaignType,
          })}
        </Typography>
        <Box
          sx={(theme) => ({
            width: `calc(${theme.spacing(1 - 2)} + 40px)`,
            ml: 1,
          })}
        />
      </CardActionArea>
      <FolderActionMenu folderId={folderId} />
    </Card>
  );
}
