import { useTranslation } from "react-i18next";
import { Box, Button, Typography } from "@mui/material";

import { ReferenceSidebarContents } from "../characterSheet/components/ReferenceSidebarContents";
import { useCampaignId } from "../gamePageLayout/hooks/useCampaignId";
import { useCampaignPermissions } from "../gamePageLayout/hooks/usePermissions";
import { pathConfig } from "pages/pathConfig";
import { useSnackbar } from "providers/SnackbarProvider";

export function GameOverviewSheet() {
  const campaignId = useCampaignId();
  const { campaignType } = useCampaignPermissions();
  const { t } = useTranslation();

  const { success } = useSnackbar();

  const inviteLink = location.origin + pathConfig.gameJoin(campaignId);
  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        success("Copied URL to clipboard");
      });
    }
  };
  return (
    <Box display="flex">
      <Box mt={2}>
        <Typography>{campaignType}</Typography>
        <Button onClick={handleCopy}>
          {t("game.copy-invite-link", "Copy Invite Link")}
        </Button>
      </Box>
      <Box>
        <ReferenceSidebarContents />
      </Box>
    </Box>
  );
}
