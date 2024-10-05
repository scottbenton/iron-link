import { Button, ButtonProps } from "@mui/material";
import { useRollOracleAndAddToLog } from "pages/games/hooks/useRollOracleAndAddToLog";
import { OracleTableRoll } from "types/DieRolls.type";

export interface OracleButtonProps extends Omit<ButtonProps, "onClick"> {
  oracleId: string;
  gmOnly?: boolean;
  onRoll?: (result: OracleTableRoll) => void;
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
