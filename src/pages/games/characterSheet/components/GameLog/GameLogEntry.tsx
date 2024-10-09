import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { Roll } from "types/DieRolls.type";
import { useUID } from "atoms/auth.atom";
import { useParams } from "react-router-dom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { campaignCharactersAtom } from "pages/games/gamePageLayout/atoms/campaign.characters.atom";
import { useAtomValue } from "jotai";
import { useUserName } from "atoms/userDetails.atom";
import { useTranslation } from "react-i18next";
import { RollSnackbar } from "components/characters/rolls/RollSnackbar";

export interface GameLogEntryProps {
  logId: string;
  log: Roll;
}

export function GameLogEntry(props: GameLogEntryProps) {
  const { logId, log } = props;
  const { t } = useTranslation();

  const uid = useUID();
  const { characterId } = useParams<{ characterId?: string }>();

  const logCharacterId = log.characterId;
  const logCharacterName = useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(campaignCharactersAtom, (state) =>
          logCharacterId
            ? state[logCharacterId]?.characterDocument.data?.name ?? null
            : undefined
        ),
      [logCharacterId]
    )
  );
  const logCreatorName = useUserName(log.uid);

  const isYourEntry = log.characterId
    ? log.characterId === characterId
    : log.uid === uid;

  let rollerName = "";
  if (logCharacterName === undefined) {
    rollerName = logCreatorName;
  } else if (logCharacterName === null) {
    rollerName = logCharacterName ?? t("common.loading", "Loading");
  } else {
    rollerName = logCharacterName;
  }

  const getLogTimeString = (d: Date) => {
    return d.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Box
      p={2}
      display={"flex"}
      flexDirection={"column"}
      alignItems={isYourEntry ? "flex-end" : "flex-start"}
    >
      <Typography>{rollerName}</Typography>
      <RollSnackbar rollId={logId} roll={log} isExpanded />
      <Typography color={"textSecondary"} variant={"caption"}>
        {getLogTimeString(log.timestamp)}
      </Typography>
    </Box>
  );
}
