import { ConditionMeter, ConditionMeterProps } from "./ConditionMeter";
import { useDebouncedSync } from "hooks/useDebouncedSync";

export interface DebouncedConditionMeterProps
  extends Omit<ConditionMeterProps, "onChange"> {
  onChange: (value: number) => void;
}

export function DebouncedConditionMeter(props: DebouncedConditionMeterProps) {
  const { onChange, ...conditionMeterProps } = props;

  const [value, setValue] = useDebouncedSync(
    onChange,
    conditionMeterProps.value ?? conditionMeterProps.defaultValue
  );

  return (
    <ConditionMeter
      {...conditionMeterProps}
      value={value}
      onChange={setValue}
    />
  );
}
