import { Button, ButtonProps } from "@mui/material";

import { useRollOracleAndAddToLog } from "components/pages/games/hooks/useRollOracleAndAddToLog";

import { IOracleTableRoll } from "services/gameLog.service";

export interface OracleButtonProps extends Omit<ButtonProps, "onClick"> {
  oracleId: string;
  gmOnly?: boolean;
  onRoll?: (result: IOracleTableRoll) => void;
}

export function OracleButton(props: OracleButtonProps) {
  const { onRoll, gmOnly, oracleId, ...buttonProps } = props;

  const rollOracle = useRollOracleAndAddToLog();

  const handleRoll = () => {
    const { result } = rollOracle(oracleId, gmOnly);
    if (result) {
      onRoll?.(result);
    }
  };

  return <Button onClick={handleRoll} {...buttonProps} />;
}
