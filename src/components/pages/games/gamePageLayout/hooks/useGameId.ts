import { useParams } from "@tanstack/react-router";

export function useGameId() {
  const { gameId } = useParams({ strict: false });
  if (!gameId) {
    throw new Error("No gameId found in route");
  }

  return gameId;
}

export function useGameIdOptional() {
  const { gameId } = useParams({ strict: false });
  return gameId;
}
