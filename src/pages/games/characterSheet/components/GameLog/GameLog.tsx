import { Box, LinearProgress } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "components/Layout/EmptyState";
import { GameLogEntry } from "pages/games/characterSheet/components/GameLog/GameLogEntry";
import {
  useGameLogs,
  useLoadMoreLogs,
} from "pages/games/gamePageLayout/atoms/gameLog.atom";

export function GameLog() {
  const { loading, error, logs, totalLogsToLoad } = useGameLogs();
  const { t } = useTranslation();

  const orderedLogs = useMemo(() => {
    return Object.entries(logs).sort(
      ([, l1], [, l2]) => l1.timestamp.getTime() - l2.timestamp.getTime(),
    );
  }, [logs]);

  const logLength = orderedLogs.length;

  const getLogs = useLoadMoreLogs();

  const hasLogs = logLength > 0;
  const doesLogLengthMatchLogsToLoad = logLength === totalLogsToLoad;
  const loadMoreLogs = useCallback(() => {
    if (hasLogs && !loading && doesLogLengthMatchLogsToLoad) {
      getLogs();
    }
  }, [getLogs, hasLogs, loading, doesLogLengthMatchLogsToLoad]);

  useEffect(() => {
    const tabPanel = document.getElementById("tabpanel-game-log");
    const loadMoreLogsElement = document.getElementById("load-more-logs");

    // use intersection observer to load more logs
    if (tabPanel && loadMoreLogsElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadMoreLogs();
            }
          });
        },
        { threshold: 0.5 },
      );

      observer.observe(loadMoreLogsElement);

      return () => {
        observer.disconnect();
      };
    }
  }, [loadMoreLogs]);

  return (
    <Box flexGrow={1}>
      {loading && <LinearProgress />}
      <div id={"load-more-logs"} />
      {error && !orderedLogs.length && (
        <EmptyState message={t("game.log.load-error", "Error loading logs")} />
      )}
      {orderedLogs.length === 0 && !loading && !error && (
        <EmptyState message={t("game.log.no-logs", "No logs yet")} />
      )}
      {orderedLogs.map(([logId, log]) => (
        <GameLogEntry key={logId} logId={logId} log={log} />
      ))}
    </Box>
  );
}
