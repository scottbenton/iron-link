import { Box, Card, Typography } from "@mui/material";
import { useMemo } from "react";

import { CardActionAreaLink } from "components/LinkComponent";

import { useUsersGames } from "stores/users.games.store";

import {
  defaultBaseRulesets,
  defaultExpansions,
} from "data/datasworn.packages";

import { usePathConfig } from "lib/paths.lib";

import { IGame } from "services/game.service";

import { GameCharacterPortraits } from "./GameCharacterPortraits";

export interface GameCardProps {
  gameId: string;
  game: IGame;
}

export function GameCard(props: GameCardProps) {
  const { gameId, game } = props;

  const pathConfig = usePathConfig();
  const { rulesets, expansions } = game;

  const gameCharacters = useUsersGames(
    (store) => store.characterDisplayDetails[gameId] ?? {},
  );

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
      <CardActionAreaLink
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          height: "100%",
          overflow: "visible",
        }}
        from={pathConfig.gameSelect}
        to={pathConfig.game}
        params={{ gameId }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={Object.keys(gameCharacters).length > 0 ? 2 : 0}
        >
          <GameCharacterPortraits gameCharacterDetails={gameCharacters} />
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
      </CardActionAreaLink>
    </Card>
  );
}
