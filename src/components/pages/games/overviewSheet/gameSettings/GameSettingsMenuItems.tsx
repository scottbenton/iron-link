import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ThemeIcon from "@mui/icons-material/Palette";
import RulesetIcon from "@mui/icons-material/PlaylistAdd";
import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { ListSubheader } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useConfirm } from "material-ui-confirm";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useSnackbar } from "providers/SnackbarProvider";

import { useGameStore } from "stores/game.store";
import { useMenuState } from "stores/menuState";

import { usePathConfig } from "lib/paths.lib";

import { useGameIdOptional } from "../../gamePageLayout/hooks/useGameId";

export interface GameSettingsMenuItemsProps {
  closeMenu: () => void;
}

export function GameSettingsMenuItems(props: GameSettingsMenuItemsProps) {
  const { closeMenu } = props;
  const { t } = useTranslation();

  const setIsGameNameDialogOpen = useMenuState(
    (state) => state.setIsGameNameDialogOpen,
  );
  const setIsRulesetDialogOpen = useMenuState(
    (state) => state.setIsRulesetDialogOpen,
  );
  const setIsGameThemeDialogOpen = useMenuState(
    (state) => state.setIsGameThemeDialogOpen,
  );

  const deleteGame = useGameStore((store) => store.deleteGame);
  const gameId = useGameIdOptional();
  const confirm = useConfirm();
  const { error } = useSnackbar();

  const navigate = useNavigate();
  const pathConfig = usePathConfig();

  const confirmDeleteGame = useCallback(() => {
    if (gameId) {
      confirm({
        title: t(
          "game.overview-sidebar.delete-game-confirm-title",
          "Delete Game?",
        ),
        description: t(
          "game.overview-sidebar.delete-game-confirm-description",
          "Are you sure you want to delete this game? This action cannot be undone.",
        ),
        confirmationText: t("common.delete", "Delete"),
        confirmationButtonProps: { color: "error" },
      })
        .then(() => {
          deleteGame(gameId)
            .then(() => {
              navigate({ to: pathConfig.gameSelect });
            })
            .catch(() => {
              error(
                t(
                  "game.overview-sidebar.delete-game-error",
                  "Failed to delete game",
                ),
              );
            });
        })
        .catch(() => {
          closeMenu();
        });
    }
  }, [confirm, gameId, deleteGame, t, error, closeMenu, navigate, pathConfig]);

  if (!gameId) {
    return null;
  }

  return (
    <>
      <ListSubheader>{t("game.game-settings", "Game Settings")}</ListSubheader>
      <MenuItem
        onClick={() => {
          setIsGameNameDialogOpen(true);
          closeMenu();
        }}
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText
          primary={t("game.overview-sidebar.edit-game-name", "Edit Game Name")}
        />
      </MenuItem>
      <MenuItem
        onClick={() => {
          setIsRulesetDialogOpen(true);
          closeMenu();
        }}
      >
        <ListItemIcon>
          <RulesetIcon />
        </ListItemIcon>
        <ListItemText
          primary={t("game.overview-sidebar.change-ruleset", "Edit Rulesets")}
        />
      </MenuItem>
      <MenuItem
        onClick={() => {
          setIsGameThemeDialogOpen(true);
          closeMenu();
        }}
      >
        <ListItemIcon>
          <ThemeIcon />
        </ListItemIcon>
        <ListItemText
          primary={t(
            "game.overview-sidebar.change-game-theme",
            "Change Game Theme",
          )}
        />
      </MenuItem>
      <MenuItem onClick={confirmDeleteGame}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText
          primary={t("game.overview-sidebar.delete-game", "Delete Game")}
        />
      </MenuItem>
    </>
  );
}
