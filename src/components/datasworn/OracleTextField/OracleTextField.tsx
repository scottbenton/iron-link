import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import RollIcon from "@mui/icons-material/Casino";
import { useSetAnnouncement } from "atoms/announcement.atom";
import { useTranslation } from "react-i18next";
import { useDataswornTree } from "atoms/dataswornTree.atom";
import { useCallback, useMemo } from "react";
import { useRollOracle } from "hooks/useRollOracle";
import { Datasworn } from "@datasworn/core";
import { getOracleRollable } from "hooks/datasworn/useOracleRollable";
import { getOracleCollection } from "hooks/datasworn/useOracleCollection";
import { OracleTableRoll } from "types/DieRolls.type";

export type OracleTextFieldOracleConfig = {
  tableIds: (string | OracleTextFieldOracleConfig)[];
  joinTables?: boolean;
  joinSeparator?: string;
};

export type OracleTextFieldProps = Omit<TextFieldProps, "onChange"> & {
  value?: string;
  oracleId?: string;
  oracleConfig?: OracleTextFieldOracleConfig;
  onChange: (value: string) => void;
};

export function OracleTextField(props: OracleTextFieldProps) {
  const { oracleId, oracleConfig, onChange, label, ...textFieldProps } = props;

  const { t } = useTranslation();
  const announce = useSetAnnouncement();

  const tree = useDataswornTree();

  const doesOracleExist = useMemo(() => {
    return checkIfAtLeastOneOracleExists(oracleId, oracleConfig, tree);
  }, [oracleId, oracleConfig, tree]);

  const getOracleResult = useRollOracle();

  const handleOracleRoll = useCallback(() => {
    let value = "";
    if (oracleId || oracleConfig) {
      value = rollOracle(oracleId ?? oracleConfig, getOracleResult);
    }
    onChange(value);
    announce(`Updated ${label} to ${value}`);
  }, [announce, label, oracleId, oracleConfig, getOracleResult, onChange]);

  return (
    <TextField
      label={label}
      fullWidth
      {...textFieldProps}
      onChange={(evt) => onChange(evt.currentTarget.value)}
      InputProps={{
        endAdornment: doesOracleExist ? (
          <InputAdornment position={"end"}>
            <Tooltip title={t("Consult the Oracle")} enterDelay={500}>
              <IconButton onClick={() => handleOracleRoll()}>
                <RollIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}

function checkIfAtLeastOneOracleExists(
  oracleId: string | undefined,
  oracleConfig: OracleTextFieldOracleConfig | undefined,
  tree: Record<string, Datasworn.RulesPackage>
): boolean {
  if (oracleId) {
    const oracle =
      getOracleRollable(oracleId, tree) ?? getOracleCollection(oracleId, tree);
    return !!oracle;
  } else if (oracleConfig) {
    for (const tableId of oracleConfig.tableIds) {
      if (typeof tableId === "string") {
        if (
          getOracleRollable(tableId, tree) ||
          getOracleCollection(tableId, tree)
        ) {
          return true;
        }
      } else {
        if (checkIfAtLeastOneOracleExists(undefined, tableId, tree)) {
          return true;
        }
      }
    }
  }
  return false;
}

function rollOracle(
  oracle: string | OracleTextFieldOracleConfig | undefined,
  getOracleResult: (oracleId: string) => OracleTableRoll | undefined
): string {
  if (!oracle) return "";
  if (typeof oracle === "string") {
    const result = getOracleResult(oracle);
    return result?.result ?? "";
  } else {
    if (oracle.joinTables) {
      // Roll each and join results
      return oracle.tableIds
        .map((tableId) => rollOracle(tableId, getOracleResult))
        .join(oracle.joinSeparator ?? " ");
    } else {
      const oracleIndex = Math.floor(Math.random() * oracle.tableIds.length);
      const subOracle = oracle.tableIds[oracleIndex];
      return rollOracle(subOracle, getOracleResult);
    }
  }
}
