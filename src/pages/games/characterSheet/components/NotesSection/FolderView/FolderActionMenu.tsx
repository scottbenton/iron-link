import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/MoreHoriz";
import { MoveDialog } from "../MoveDialog";
import { useDerivedNotesAtom } from "pages/games/gamePageLayout/atoms/notes.atom";
import { useTranslation } from "react-i18next";
import { useFolderPermission } from "../NoteView/useFolderPermissions";

export interface FolderActionMenuProps {
  folderId: string;
}

export function FolderActionMenu(props: FolderActionMenuProps) {
  const { folderId } = props;

  const { t } = useTranslation();

  const { /**canEdit, canDelete,*/ canChangePermissions } =
    useFolderPermission(folderId);

  const parentFolderId = useDerivedNotesAtom(
    (store) => store.folders.folders[folderId].parentFolderId,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuParentRef = useRef<HTMLButtonElement>(null);

  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  if (/**!canEdit && !canDelete &&*/ !canChangePermissions || !parentFolderId) {
    return null;
  }

  return (
    <>
      <IconButton
        sx={(theme) => ({
          position: "absolute",
          right: theme.spacing(1),
          zIndex: 1,
          top: "50%",
          transform: "translateY(-50%)",
        })}
        ref={menuParentRef}
        onClick={() => setIsMenuOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        anchorEl={menuParentRef.current}
      >
        {canChangePermissions && parentFolderId && (
          <MenuItem
            onClick={() => {
              setIsMoveDialogOpen(true);
              setIsMenuOpen(false);
            }}
          >
            {t("notes.folder-menu.move", "Move Folder")}
          </MenuItem>
        )}
      </Menu>
      {parentFolderId && (
        <MoveDialog
          open={isMoveDialogOpen}
          onClose={() => setIsMoveDialogOpen(false)}
          item={{
            type: "folder",
            id: folderId,
            parentFolderId: parentFolderId,
          }}
        />
      )}
    </>
  );
}
