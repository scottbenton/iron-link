import { Box, Typography } from "@mui/material";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

enum Tabs {
  Moves = "moves",
  Oracles = "oracles",
  GameLog = "game-log",
}

function tabProps(tab: Tabs) {
  return {
    value: tab,
    id: `tab-${tab}`,
    "aria-controls": `tabpanel-${tab}`,
  };
}

function tabPanelProps(tab: Tabs, value: Tabs) {
  return {
    hidden: tab !== value,
    role: "tabpanel",
    id: `tabpanel-${tab}`,
    "aria-labelledby": `tab-${tab}`,
  };
}

export function ReferenceSidebarContents() {
  const { t } = useTranslation();

  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.Moves);
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography fontFamily={"fontFamilyTitle"} textTransform={"uppercase"}>
          {t("Reference")}
        </Typography>
      </Box>
      <StyledTabs
        sx={{ mx: -2, mb: 2 }}
        centered
        value={currentTab}
        onChange={(_, value) => setCurrentTab(value as unknown as Tabs)}
      >
        <StyledTab label={t("Moves")} {...tabProps(Tabs.Moves)} />
        <StyledTab label={t("Oracles")} {...tabProps(Tabs.Oracles)} />
        <StyledTab label={t("Game Log")} {...tabProps(Tabs.GameLog)} />
      </StyledTabs>
      <div {...tabPanelProps(Tabs.Moves, currentTab)}>
        <Typography>Moves</Typography>
      </div>
      <div {...tabPanelProps(Tabs.Oracles, currentTab)}>
        <Typography>Oracles</Typography>
      </div>
      <div {...tabPanelProps(Tabs.GameLog, currentTab)}>
        <Typography>Game Log</Typography>
      </div>
    </>
  );
}
