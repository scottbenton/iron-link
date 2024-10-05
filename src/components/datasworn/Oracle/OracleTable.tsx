import { Datasworn } from "@datasworn/core";
import { OracleRollableTable } from "./OracleRollableTable";
import { OracleRollableColumn } from "./OracleRollableColumn";

export interface OracleTableProps {
  oracle: Datasworn.OracleRollable | Datasworn.EmbeddedOracleRollable;
}

export function OracleTable(props: OracleTableProps) {
  const { oracle } = props;

  if (
    oracle.oracle_type === "table_text" ||
    oracle.oracle_type === "table_text2" ||
    oracle.oracle_type === "table_text3"
  ) {
    return <OracleRollableTable oracle={oracle} />;
  } else if (
    oracle.oracle_type === "column_text" ||
    oracle.oracle_type === "column_text2" ||
    oracle.oracle_type === "column_text3"
  ) {
    return <OracleRollableColumn oracle={oracle} />;
  }
}
