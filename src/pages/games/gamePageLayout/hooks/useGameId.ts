import { useParams } from "react-router-dom";

export function useGameId() {
  const { gameId } = useParams<{ gameId: string }>();
  if (!gameId) {
    throw new Error("No gameId found in route");
  }

  return gameId;
}
