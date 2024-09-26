import { Box, Checkbox, FormControlLabel, SxProps, Theme } from "@mui/material";
import {
  defaultBaseRulesets,
  defaultExpansions,
} from "data/datasworn.packages";

export interface RulesPackageSelectorProps {
  activeRulesetConfig: Record<string, boolean>;
  onRulesetChange: (rulesetKey: string, isActive: boolean) => void;
  activeExpansionConfig: Record<string, Record<string, boolean>>;
  onExpansionChange: (
    rulesetKey: string,
    expansionKey: string,
    isActive: boolean
  ) => void;
  sx?: SxProps<Theme>;
}

export function RulesPackageSelector(props: RulesPackageSelectorProps) {
  const {
    activeRulesetConfig,
    onRulesetChange,
    activeExpansionConfig,
    onExpansionChange,
    sx,
  } = props;

  const rulesets = defaultBaseRulesets;
  const expansions = defaultExpansions;

  return (
    <Box sx={sx}>
      {Object.entries(rulesets).map(([rulesetKey, ruleset]) => (
        <Box key={rulesetKey}>
          <FormControlLabel
            label={ruleset.title}
            control={
              <Checkbox checked={activeRulesetConfig[rulesetKey] ?? false} />
            }
            onChange={(_, checked) => onRulesetChange(rulesetKey, checked)}
          />
          <Box ml={1} borderColor={"divider"} borderLeft={`1px dotted`} pl={2}>
            {Object.entries(expansions[rulesetKey] || {}).map(
              ([expansionKey, expansion]) => (
                <FormControlLabel
                  key={expansionKey}
                  label={expansion.title}
                  control={
                    <Checkbox
                      checked={
                        activeRulesetConfig[rulesetKey]
                          ? activeExpansionConfig[rulesetKey]?.[expansionKey] ??
                            false
                          : false
                      }
                    />
                  }
                  onChange={(_, checked) =>
                    onExpansionChange(rulesetKey, expansionKey, checked)
                  }
                  disabled={!activeRulesetConfig[rulesetKey]} // Disable if the ruleset is not active
                />
              )
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
