import { useEffect } from "react";

import { ColorScheme, useSetColorScheme } from "atoms/theme.atom";

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
