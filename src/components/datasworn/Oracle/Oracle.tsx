import { Box, SxProps, Theme, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { OracleButton } from "components/datasworn/Oracle/OracleButton";
import { OracleTable } from "components/datasworn/Oracle/OracleTable";
import { EmptyState } from "components/Layout/EmptyState";
import { MarkdownRenderer } from "components/MarkdownRenderer";
import { useOracleRollable } from "hooks/datasworn/useOracleRollable";

export interface OracleProps {
  oracleId: string;
  hideOracleName?: boolean;
  sx?: SxProps<Theme>;
}

export function Oracle(props: OracleProps) {
  const { oracleId, hideOracleName, sx } = props;
  const oracle = useOracleRollable(oracleId);

  const { t } = useTranslation();

  if (!oracle) {
    return (
      <EmptyState
        message={t(
          "datasworn.oracles.not-found",
          "Could not find oracle with id {{oracleId}}",
          { oracleId },
        )}
      />
    );
  }

  return (
    <Box sx={sx} bgcolor="background.paper">
      {!hideOracleName && <Typography variant={"h6"}>{oracle.name}</Typography>}
      {(oracle as unknown as { summary?: string }).summary && (
        <MarkdownRenderer
          markdown={(oracle as unknown as { summary: string }).summary}
        />
      )}
      <OracleButton oracleId={oracle._id} color="inherit" variant="outlined">
        {t("datasworn.roll-oracle-button", "Roll {{oracleName}}", {
          oracleName: oracle.name,
        })}
      </OracleButton>
      <OracleTable oracle={oracle} />
    </Box>
  );
}
