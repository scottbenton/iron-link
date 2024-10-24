import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import { useAtomValue } from "jotai";

import { useUID } from "atoms/auth.atom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { useUserName } from "atoms/userDetails.atom";
import { RollSnackbar } from "components/characters/rolls/RollSnackbar";
import { NormalRollActions } from "pages/games/characterSheet/components/GameLog/NormalRollActions";
import { campaignCharactersAtom } from "pages/games/gamePageLayout/atoms/campaign.characters.atom";
import { Roll } from "types/DieRolls.type";

export interface GameLogEntryProps {
  logId: string;
  log: Roll;
}

export function GameLogEntry(props: GameLogEntryProps) {
  const { logId, log } = props;
  const { t } = useTranslation();

  const uid = useUID();

  const logCharacterId = log.characterId;
  const logCharacterName = useAtomValue(
    useMemo(
      () =>
        derivedAtomWithEquality(campaignCharactersAtom, (state) =>
          logCharacterId
            ? (state[logCharacterId]?.characterDocument.data?.name ?? null)
            : undefined,
        ),
      [logCharacterId],
    ),
  );
  const logCreatorName = useUserName(log.uid);

  const isYourEntry = log.uid === uid;

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
      <RollSnackbar
        actions={<NormalRollActions rollId={logId} roll={log} />}
        rollId={logId}
        roll={log}
        isExpanded
      />
      <Typography color={"textSecondary"} variant={"caption"}>
        {getLogTimeString(log.timestamp)}
      </Typography>
    </Box>
  );
}
