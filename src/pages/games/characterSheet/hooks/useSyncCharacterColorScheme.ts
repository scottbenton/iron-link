import { useEffect } from "react";

import { useCharacterId } from "./useCharacterId";
import { useDerivedCharacterState } from "./useDerivedCharacterState";
import { ColorScheme, useSetColorScheme } from "atoms/theme.atom";

export function useSyncCharacterColorScheme() {
  const characterId = useCharacterId();
  const characterTheme = useDerivedCharacterState(
    characterId,
    (character) =>
      character?.characterDocument.data?.colorScheme ?? ColorScheme.Default,
  );
  const setColorScheme = useSetColorScheme();

  useEffect(() => {
    setColorScheme(characterTheme);
    return () => {
      setColorScheme(ColorScheme.Default);
    };
  }, [characterTheme, setColorScheme]);
}
