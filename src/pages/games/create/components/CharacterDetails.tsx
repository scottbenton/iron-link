import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

import {
  OracleTextField,
  OracleTextFieldOracleConfig,
} from "components/datasworn/OracleTextField";

import { dataswornTreeAtom } from "atoms/dataswornTree.atom";

import { ironswornId, starforgedId } from "data/datasworn.packages";

import { useCreateCharacterAtom } from "../atoms/createCharacter.atom";
import { ImageInput } from "./ImageInput";

const nameOracles: Record<string, OracleTextFieldOracleConfig> = {
  [ironswornId]: {
    tableIds: [
      "oracle_rollable:classic/name/ironlander/a",
      "oracle_rollable:classic/name/ironlander/b",
    ],
  },
  [starforgedId]: {
    tableIds: [
      "oracle_rollable:starforged/character/name/given_name",
      "oracle_rollable:starforged/character/name/family_name",
    ],
    joinTables: true,
  },
};

export function CharacterDetails() {
  const [character, setCharacter] = useCreateCharacterAtom();
  const rulesets = useAtomValue(dataswornTreeAtom);

  const { name, portrait } = character;

  const activeNameOracles = useMemo(() => {
    const oracles: OracleTextFieldOracleConfig = {
      tableIds: [],
    };
    if (rulesets[ironswornId]) {
      oracles.tableIds.push(nameOracles[ironswornId]);
    }
    if (rulesets[starforgedId]) {
      oracles.tableIds.push(nameOracles[starforgedId]);
    }
    return oracles;
  }, [rulesets]);

  return (
    <Box display={"flex"} alignItems={"center"} mt={1}>
      <ImageInput
        value={portrait}
        onChange={(value) =>
          setCharacter((prev) => ({ ...prev, portrait: value }))
        }
      />
      <OracleTextField
        oracleConfig={activeNameOracles}
        label={"Character Name"}
        fullWidth
        color={"primary"}
        value={name}
        onChange={(value) => setCharacter((prev) => ({ ...prev, name: value }))}
        sx={{ maxWidth: 350, ml: 2 }}
      />
    </Box>
  );
}
