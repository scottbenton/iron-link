import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { useMemo } from "react";

import { CampaignDocument } from "api-calls/campaign/_campaign.type";
import { LinkComponent } from "components/LinkComponent";
import {
  defaultBaseRulesets,
  defaultExpansions,
} from "data/datasworn.packages";
import { CampaignCharacterPortraits } from "pages/games/selectPage/CampaignCharacterPortraits";
import { pathConfig } from "pages/pathConfig";

export interface CampaignCardProps {
  campaignId: string;
  campaign: CampaignDocument;
}

export function CampaignCard(props: CampaignCardProps) {
  const { campaignId, campaign } = props;

  const { rulesets, expansions } = campaign;

  const rulesPackageString = useMemo(() => {
    const packageNames: string[] = [];

    Object.entries(rulesets).forEach(([rulesetId, isRulesetActive]) => {
      if (isRulesetActive) {
        const ruleset = defaultBaseRulesets[rulesetId];
        packageNames.push(ruleset.title);

        Object.entries(expansions[rulesetId] ?? {}).forEach(
          ([expansionId, isExpansionActive]) => {
            if (isExpansionActive) {
              const expansion = defaultExpansions[rulesetId]?.[expansionId];
              packageNames.push(expansion.title);
            }
          },
        );
      }
    });

    return packageNames.join(", ");
  }, [rulesets, expansions]);

  return (
    <Card variant={"outlined"} sx={{ height: "100%", overflow: "visible" }}>
      <CardActionArea
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          height: "100%",
          overflow: "visible",
        }}
        LinkComponent={LinkComponent}
        href={pathConfig.game(campaignId)}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={campaign.characters.length > 0 ? 2 : 0}
        >
          <CampaignCharacterPortraits
            campaignCharacters={campaign.characters}
          />
          <div>
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.typography.fontFamilyTitle}
              textTransform="uppercase"
            >
              {campaign.name}
            </Typography>
            <Typography
              color="text.secondary"
              fontFamily={(theme) => theme.typography.fontFamilyTitle}
              textTransform="uppercase"
            >
              {rulesPackageString}
            </Typography>
          </div>
        </Box>
      </CardActionArea>
    </Card>
  );
}
