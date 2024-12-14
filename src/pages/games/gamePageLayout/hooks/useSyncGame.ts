import { useParams } from "react-router-dom";

import { useListenToGameAssets } from "stores/assets.store";
import { useListenToGame } from "stores/game.store";
import { useListenToGameCharacters } from "stores/gameCharacters.store";
import { useListenToTracks } from "stores/tracks.store";

export function useSyncGame() {
  const { gameId } = useParams<{ gameId: string }>();

  useListenToGame(gameId);
  useListenToGameCharacters(gameId);
  useListenToGameAssets(gameId);
  useListenToTracks(gameId);

  // useListenToLogs();
  // useSyncNotes();
}
