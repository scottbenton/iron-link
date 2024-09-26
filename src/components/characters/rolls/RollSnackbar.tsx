import { Roll, RollType } from "types/DieRolls.type";
import { StatRollSnackbar } from "./StatRollSnackbar";
import { RollCard } from "./common";

export interface RollSnackbarProps {
  rollId: string;
  roll: Roll;
  isExpanded: boolean;
  onSnackbarClick?: () => void;
}

export function RollSnackbar(props: RollSnackbarProps) {
  const { rollId, roll, isExpanded, onSnackbarClick } = props;

  return (
    <RollCard onClick={onSnackbarClick}>
      {roll.type === RollType.Stat && (
        <StatRollSnackbar rollId={rollId} roll={roll} isExpanded={isExpanded} />
      )}
    </RollCard>
  );
}
