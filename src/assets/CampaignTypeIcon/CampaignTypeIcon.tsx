import { SvgIconProps } from "@mui/material";

import { GameType } from "repositories/game.repository";

import { CoopIcon } from "./CoopIcon";
import { GuidedIcon } from "./GuidedIcon";
import { SoloIcon } from "./SoloIcon";

export interface GameTypeIconProps extends SvgIconProps {
  gameType: GameType;
}
export function GameTypeIcon(props: GameTypeIconProps) {
  const { gameType, ...rest } = props;

  switch (gameType) {
    case GameType.Solo:
      return <SoloIcon {...rest} />;
    case GameType.Coop:
      return <CoopIcon {...rest} />;
    case GameType.Guided:
      return <GuidedIcon {...rest} />;
    default:
      return null;
  }
}
