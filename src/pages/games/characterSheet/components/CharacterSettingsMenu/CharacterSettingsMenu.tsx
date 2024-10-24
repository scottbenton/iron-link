import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CharacterIcon from "@mui/icons-material/AccountBox";
import CharacterSettingsIcon from "@mui/icons-material/ManageAccounts";
import StatsIcon from "@mui/icons-material/Numbers";
import ThemeIcon from "@mui/icons-material/Palette";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

import { CharacterDetailsDialog } from "./CharacterDetailsDialog";
import { CharacterStatsDialog } from "./CharacterStatsDialog";
import { ColorSchemeDialog } from "./ColorSchemeDialog";
import { DeleteCharacterButton } from "./DeleteCharacterButton";
import {
  CharacterPermissionType,
  useCampaignPermissions,
} from "pages/games/gamePageLayout/hooks/usePermissions";

export function CharacterSettingsMenu() {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isCharacterOwner =
    useCampaignPermissions().characterPermission ===
    CharacterPermissionType.Owner;

  const { t } = useTranslation();

  const [isCharacterDetailsDialogOpen, setIsCharacterDetailsDialogOpen] =
    useState(false);
  const [isCharacterStatsDialogOpen, setIsCharacterStatsDialogOpen] =
    useState(false);
  const [isColorSchemeDialogOpen, setIsColorSchemeDialogOpen] = useState(false);

  if (!isCharacterOwner) {
    return null;
  }

  return (
    <>
      <IconButton
        ref={buttonRef}
        sx={{ mt: -1, mr: -1 }}
        onClick={() => setIsSettingsMenuOpen(true)}
      >
        <CharacterSettingsIcon />
      </IconButton>
      <Menu
        open={isSettingsMenuOpen}
        anchorEl={buttonRef.current}
        onClose={() => setIsSettingsMenuOpen(false)}
      >
        <MenuItem
          onClick={() => {
            setIsCharacterDetailsDialogOpen(true);
            setIsSettingsMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <CharacterIcon />
          </ListItemIcon>
          <ListItemText
            primary={t(
              "character.character-sidebar.change-name-or-portrait",
              "Change Name or Portrait",
            )}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsCharacterStatsDialogOpen(true);
            setIsSettingsMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <StatsIcon />
          </ListItemIcon>
          <ListItemText
            primary={t(
              "character.character-sidebar.update-stats",
              "Update Stats",
            )}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            setIsColorSchemeDialogOpen(true);
            setIsSettingsMenuOpen(false);
          }}
        >
          <ListItemIcon>
            <ThemeIcon />
          </ListItemIcon>
          <ListItemText
            primary={t(
              "character.character-sidebar.change-theme",
              "Change Theme",
            )}
          />
        </MenuItem>
        <DeleteCharacterButton closeMenu={() => setIsSettingsMenuOpen(false)} />
      </Menu>
      <CharacterDetailsDialog
        open={isCharacterDetailsDialogOpen}
        onClose={() => setIsCharacterDetailsDialogOpen(false)}
      />
      <CharacterStatsDialog
        open={isCharacterStatsDialogOpen}
        onClose={() => setIsCharacterStatsDialogOpen(false)}
      />
      <ColorSchemeDialog
        open={isColorSchemeDialogOpen}
        onClose={() => setIsColorSchemeDialogOpen(false)}
      />
    </>
  );
}
