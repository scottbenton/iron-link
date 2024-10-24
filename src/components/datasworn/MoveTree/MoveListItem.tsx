import { useState } from "react";
import { Datasworn } from "@datasworn/core";
import ChevronIcon from "@mui/icons-material/ChevronRight";
import {
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Move } from "components/datasworn/Move";
import {
  MoveVisibilityState,
  VisibilitySettings,
} from "components/datasworn/MoveTree/getMoveCategoryVisibility";

export interface MoveListItemProps {
  move: Datasworn.Move;
  disabled?: boolean;
  visibilitySettings: VisibilitySettings;
  isSearchActive: boolean;
  isFullCollectionVisible: boolean;
}

export function MoveListItem(props: MoveListItemProps) {
  const {
    move,
    disabled,
    visibilitySettings,
    isSearchActive,
    isFullCollectionVisible,
  } = props;

  let moveVisibility = MoveVisibilityState.Visible;
  if (isSearchActive && !isFullCollectionVisible) {
    moveVisibility =
      visibilitySettings.visibleMoves[move._id] ?? MoveVisibilityState.Hidden;
  }

  const [isExpanded, setIsExpanded] = useState(false);

  if (moveVisibility === MoveVisibilityState.Hidden) {
    return null;
  }

  return (
    <>
      <ListItem
        disablePadding
        sx={(theme) => ({
          bgcolor:
            theme.palette.grey[theme.palette.mode === "light" ? 100 : 800],
        })}
      >
        <ListItemButton
          disabled={disabled}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <ListItemText>{move.name}</ListItemText>
          <ListItemIcon sx={{ minWidth: "unset" }}>
            <ChevronIcon
              sx={(theme) => ({
                transform: `rotate(${isExpanded ? "-90deg" : "0deg"})`,
                transition: theme.transitions.create(["transform"], {
                  duration: theme.transitions.duration.shorter,
                }),
              })}
            />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Collapse unmountOnExit in={isExpanded}>
        <Move moveId={move._id} hideMoveName sx={{ px: 2, py: 1 }} />
      </Collapse>
    </>
  );
}
