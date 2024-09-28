import { Datasworn } from "@datasworn/core";
import { ListItem } from "@mui/material";
import {
  MoveVisibilityState,
  VisibilitySettings,
} from "./getMoveCategoryVisibility";

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

  if (moveVisibility === MoveVisibilityState.Hidden) {
    return null;
  }

  return <ListItem>{move.name}</ListItem>;
}
