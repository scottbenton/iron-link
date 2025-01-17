import OpenIcon from "@mui/icons-material/ChevronRight";
import { Box, Button, Card, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useSnackbar } from "providers/SnackbarProvider";

import { ButtonLink, CardActionAreaLink } from "components/LinkComponent";
import { PortraitAvatar } from "components/characters/PortraitAvatar";

import { GamePermission, useGameStore } from "stores/game.store";
import { useGameCharactersStore } from "stores/gameCharacters.store";

import { usePathConfig } from "lib/paths.lib";

import { GameType } from "repositories/game.repository";

import { GamePlayerRole } from "services/game.service";

import { useGameId } from "../gamePageLayout/hooks/useGameId";
import { useGamePermissions } from "../gamePageLayout/hooks/usePermissions";
import { UserCard } from "./UserCard";

export function CharactersAndUsersTab() {
  const gameId = useGameId();

  const characters = useGameCharactersStore((state) =>
    Object.values(state.characters).map((character) => ({
      id: character.id,
      name: character.name,
      userId: character.uid,
      portraitSettings: character.profileImage,
    })),
  );

  const users = useGameStore((store) => store.gamePlayers ?? {});

  const { t } = useTranslation();

  const pathConfig = usePathConfig();

  const { gameType, gamePermission } = useGamePermissions();
  const areAnyPlayersGuides = useMemo(() => {
    return Object.values(users).some(
      (user) => user.role === GamePlayerRole.Guide,
    );
  }, [users]);

  const { success } = useSnackbar();
  const handleCopy = useCallback(() => {
    const inviteLink = location.origin + `/games/${gameId}/join`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      success("Copied URL to clipboard");
    });
  }, [gameId, success]);

  return (
    <>
      <Typography variant={"h6"} fontFamily={"fontFamilyTitle"} mt={2}>
        {t("game.overview.characters", "Characters")}
      </Typography>
      {characters.map((character) => (
        <Card key={character.id}>
          <CardActionAreaLink
            to={pathConfig.gameCharacter}
            params={{ gameId, characterId: character.id }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              pr: 2,
            }}
          >
            <Box display={"flex"} alignItems={"center"}>
              <PortraitAvatar
                characterId={character.id}
                name={character.name}
                portraitSettings={character.portraitSettings ?? undefined}
              />
              <Typography variant="h5" fontFamily="fontFamilyTitle" ml={2}>
                {character.name}
              </Typography>
            </Box>
            <OpenIcon sx={{ ml: 2 }} />
          </CardActionAreaLink>
        </Card>
      ))}
      {gamePermission !== GamePermission.Viewer && (
        <ButtonLink
          to={pathConfig.gameCharacterCreate}
          params={{ gameId }}
          sx={{ mt: 1 }}
          variant="outlined"
          color="inherit"
        >
          {t("game.overview.add-character", "Add Character")}
        </ButtonLink>
      )}

      {gameType !== GameType.Solo && (
        <>
          <Typography variant={"h6"} fontFamily={"fontFamilyTitle"} mt={2}>
            {t("game.overview.players", "Players")}
          </Typography>
          {Object.entries(users).map(([userId, user]) => (
            <UserCard
              key={userId}
              gameId={gameId}
              uid={userId}
              role={user.role}
              gamePermission={gamePermission}
              gameType={gameType}
              areAnyPlayersGuides={areAnyPlayersGuides}
            />
          ))}
          {gamePermission !== GamePermission.Viewer && (
            <Button
              variant="outlined"
              color="inherit"
              sx={{ mt: 1 }}
              onClick={handleCopy}
            >
              {t("game.overview.invite", "Copy Invite Link")}
            </Button>
          )}
        </>
      )}
    </>
  );
}
