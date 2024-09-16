import { OracleTextField, OracleTextFieldProps } from "./OracleTextField";
import { useDebouncedSync } from "hooks/useDebouncedSync";

export function DebouncedOracleTextField(props: OracleTextFieldProps) {
  const { value: nonDebouncedValue, onChange, ...textFieldProps } = props;
  const [value, setValue] = useDebouncedSync(onChange, nonDebouncedValue ?? "");

  return (
    <OracleTextField value={value} onChange={setValue} {...textFieldProps} />
  );
}
