import { Box, Input, InputAdornment, List, ListSubheader } from "@mui/material";
import { useDeferredValue, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import { useOracles } from "atoms/dataswornRules/useOracles";
import { OracleCollectionListItem } from "./OracleCollectionListItem";
import {
  CollectionVisibilityState,
  getOracleCollectionVisibility,
  OracleVisibilityState,
  VisibilitySettings,
} from "./getOracleCollectionVisiblity";
import { AskTheOracleButtons } from "./AskTheOracleButtons";

export function OracleTree() {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue);

  const { rootOracleCollections, oracleCollectionMap, oracleRollableMap } =
    useOracles();

  const visibilitySettings = useMemo(() => {
    const visibleCollections: Record<string, CollectionVisibilityState> = {};
    const visibleOracles: Record<string, OracleVisibilityState> = {};

    Object.values(rootOracleCollections).forEach(({ rootOracles }) => {
      rootOracles.forEach((oracleId) => {
        getOracleCollectionVisibility(
          deferredSearchValue,
          oracleId,
          oracleCollectionMap,
          oracleRollableMap,
          visibleCollections,
          visibleOracles
        );
      });
    });

    return {
      visibleCollections,
      visibleOracles,
    } as VisibilitySettings;
  }, [
    rootOracleCollections,
    oracleCollectionMap,
    oracleRollableMap,
    deferredSearchValue,
  ]);

  return (
    <Box bgcolor={"background.paper"}>
      <AskTheOracleButtons />
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        fullWidth
        startAdornment={
          <InputAdornment position={"start"}>
            <SearchIcon sx={(theme) => ({ color: theme.palette.grey[300] })} />
          </InputAdornment>
        }
        aria-label={t("datasworn.filter-oracles", "Filter Oracles")}
        placeholder={t("datasworn.filter-oracles", "Filter Oracles")}
        color={"primary"}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          px: 2,
          py: 1,
        }}
      />
      {Object.entries(rootOracleCollections).map(
        ([rulesetKey, ruleset], _, arr) => (
          <List key={rulesetKey} disablePadding>
            {arr.length > 1 && (
              <ListSubheader
                sx={(theme) => ({
                  bgcolor:
                    theme.palette.mode === "light" ? "grey.300" : "grey.950",
                  mt: 0,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  px: 2,
                  fontFamily: theme.typography.fontFamilyTitle,
                })}
                key={rulesetKey}
              >
                {ruleset.title}
              </ListSubheader>
            )}
            {ruleset.rootOracles.map((collectionKey) => (
              <OracleCollectionListItem
                key={collectionKey}
                oracleCollectionId={collectionKey}
                oracleCollectionMap={oracleCollectionMap}
                oracleRollableMap={oracleRollableMap}
                visibilitySettings={visibilitySettings}
                isSearchActive={!!deferredSearchValue.trim()}
              />
            ))}
          </List>
        )
      )}
    </Box>
  );
}
