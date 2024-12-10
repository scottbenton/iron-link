import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { useMemo } from "react";

import { LinkComponent } from "components/LinkComponent";

import { pathConfig } from "pages/pathConfig";

import {
  defaultBaseRulesets,
  defaultExpansions,
} from "data/datasworn.packages";

import { IGame } from "services/game.service";

import { CampaignCharacterPortraits } from "./GameCharacterPortraits";

export interface GameCardProps {
  gameId: string;
  game: IGame;
}

export function GameCard(props: GameCardProps) {
  const { gameId, game } = props;

  const { rulesets, expansions } = game;

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
        href={pathConfig.game(gameId)}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={game.characters.length > 0 ? 2 : 0}
        >
          <CampaignCharacterPortraits gameCharacters={game.characters} />
          <div>
            <Typography
              variant={"h5"}
              fontFamily={(theme) => theme.typography.fontFamilyTitle}
              textTransform="uppercase"
            >
              {game.name}
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
