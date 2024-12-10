import { useEffect } from "react";

import { useSetColorScheme } from "stores/appState.store";

import { ColorScheme } from "repositories/shared.types";

import { useDerivedCurrentCharacterState } from "./useDerivedCharacterState";

export function useSyncCharacterColorScheme() {
  const characterTheme = useDerivedCurrentCharacterState(
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
