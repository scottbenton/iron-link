import { useParams } from "react-router-dom";

export function useCharacterId() {
  const { characterId } = useParams<{ characterId: string }>();
  if (!characterId) {
    throw new Error("No characterId found in route");
  }

  return characterId;
}
