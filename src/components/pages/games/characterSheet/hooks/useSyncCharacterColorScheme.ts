import { useEffect } from "react";

import { useSetColorScheme } from "stores/appState.store";
import { useGameCharacter } from "stores/gameCharacters.store";

import { ColorScheme } from "repositories/shared.types";

export function useSyncCharacterColorScheme() {
  const characterTheme = useGameCharacter(
    (character) => character?.colorScheme ?? ColorScheme.Default,
  );
  const setColorScheme = useSetColorScheme();

  useEffect(() => {
    setColorScheme(characterTheme);
    return () => {
      setColorScheme(ColorScheme.Default);
    };
  }, [characterTheme, setColorScheme]);
}
