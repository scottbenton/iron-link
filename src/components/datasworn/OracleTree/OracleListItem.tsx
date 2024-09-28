import { Datasworn } from "@datasworn/core";
import { ListItem } from "@mui/material";
import {
  OracleVisibilityState,
  VisibilitySettings,
} from "./getOracleCollectionVisiblity";

export interface OracleListItemProps {
  oracle: Datasworn.OracleRollable;
  disabled?: boolean;
  visibilitySettings: VisibilitySettings;
  isSearchActive: boolean;
  isFullCollectionVisible: boolean;
}

export function OracleListItem(props: OracleListItemProps) {
  const {
    oracle,
    disabled,
    visibilitySettings,
    isSearchActive,
    isFullCollectionVisible,
  } = props;

  let oracleVisibility = OracleVisibilityState.Visible;
  if (isSearchActive && !isFullCollectionVisible) {
    oracleVisibility =
      visibilitySettings.visibleOracles[oracle._id] ??
      OracleVisibilityState.Hidden;
  }

  if (oracleVisibility === OracleVisibilityState.Hidden) {
    return null;
  }

  return <ListItem>{oracle.name}</ListItem>;
}
