import { ColorScheme, useSetColorScheme } from "atoms/theme.atom";
import { useCharacterId } from "./useCharacterId";
import { useDerivedCharacterState } from "./useDerivedCharacterState";
import { useEffect } from "react";

export function useSyncCharacterColorScheme() {
  const characterId = useCharacterId();
  const characterTheme = useDerivedCharacterState(
    characterId,
    (character) =>
      character?.characterDocument.data?.colorScheme ?? ColorScheme.Default
  );
  const setColorScheme = useSetColorScheme();

  useEffect(() => {
    setColorScheme(characterTheme);
    return () => {
      setColorScheme(ColorScheme.Default);
    };
  }, [characterTheme, setColorScheme]);
}
