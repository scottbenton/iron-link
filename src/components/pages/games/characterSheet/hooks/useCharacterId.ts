import { useParams } from "@tanstack/react-router";

export function useCharacterId() {
  const { characterId } = useParams({ strict: false });
  if (!characterId) {
    throw new Error("No characterId found in route");
  }

  return characterId;
}

export function useCharacterIdOptional() {
  const { characterId } = useParams({ strict: false });

  return characterId;
}
