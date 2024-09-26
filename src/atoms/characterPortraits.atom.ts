import { getCharacterPortraitUrl } from "api-calls/character/getCharacterPortrait";
import { atom, useAtom } from "jotai";
import { useEffect, useMemo } from "react";

const characterPortraitsAtom = atom<{
  [key: string]: {
    url?: string;
    filename: string;
    loading: boolean;
  };
}>({});

export function useCharacterPortraitsAtom() {
  return useAtom(characterPortraitsAtom);
}

export function useCharacterPortrait(characterId: string) {
  const [portrait] = useAtom(
    useMemo(
      () => atom((get) => get(characterPortraitsAtom)[characterId]),
      [characterId]
    )
  );
  return portrait ?? { url: undefined, filename: "", loading: false };
}

export function useLoadCharacterPortrait(
  characterId: string,
  filename?: string
) {
  const [portraits, setPortraits] = useCharacterPortraitsAtom();

  useEffect(() => {
    if (filename) {
      if (portraits[characterId]?.filename !== filename) {
        setPortraits((prev) => {
          const newPortraits = { ...prev };
          newPortraits[characterId] = {
            url: undefined,
            filename,
            loading: true,
          };
          return newPortraits;
        });
      } else if (!portraits[characterId]?.url) {
        getCharacterPortraitUrl({ characterId, filename })
          .then((url) => {
            setPortraits((prev) => ({
              ...prev,
              [characterId]: { url, filename, loading: false },
            }));
          })
          .catch((e) => {
            console.error(e);
            setPortraits((prev) => ({
              ...prev,
              [characterId]: { url: undefined, filename, loading: false },
            }));
          });
      }
    } else if (portraits[characterId]) {
      setPortraits((prev) => {
        const newPortraits = { ...prev };
        delete newPortraits[characterId];
        return newPortraits;
      });
    }
  }, [characterId, filename, portraits, setPortraits]);
}
