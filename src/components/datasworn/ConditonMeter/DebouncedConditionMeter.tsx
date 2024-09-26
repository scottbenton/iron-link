import { ConditionMeter, ConditionMeterProps } from "./ConditionMeter";
import { useDebouncedSync } from "hooks/useDebouncedSync";

export interface DebouncedConditionMeterProps
  extends Omit<ConditionMeterProps, "onChange" | "onActionClick"> {
  onActionClick?: (setValue: (value: number) => void) => void;
  onChange: (value: number) => void;
}

export function DebouncedConditionMeter(props: DebouncedConditionMeterProps) {
  const { onChange, onActionClick, ...conditionMeterProps } = props;

  const [value, setValue] = useDebouncedSync(
    onChange,
    conditionMeterProps.value ?? conditionMeterProps.defaultValue
  );

  return (
    <ConditionMeter
      {...conditionMeterProps}
      onActionClick={onActionClick ? () => onActionClick(setValue) : undefined}
      value={value}
      onChange={setValue}
    />
  );
}
