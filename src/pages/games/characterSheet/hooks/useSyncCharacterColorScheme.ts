import { useEffect } from "react";

import { ColorScheme, useSetColorScheme } from "atoms/theme.atom";
import { useCharacterId } from "pages/games/characterSheet/hooks/useCharacterId";
import { useDerivedCharacterState } from "pages/games/characterSheet/hooks/useDerivedCharacterState";

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
