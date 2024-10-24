import { atom, useAtom } from "jotai";
import { useCallback } from "react";

import { AssetDocument } from "api-calls/assets/_asset.type";

export interface ICreateCharacterAtom {
  name: string;
  portrait?: {
    image: File | string;
    scale: number;
    position: {
      x: number;
      y: number;
    };
  };
  stats: Record<string, number>;
  characterAssets: AssetDocument[];
  gameAssets: AssetDocument[];
}

const defaultState: ICreateCharacterAtom = {
  name: "",
  portrait: undefined,
  stats: {},
  characterAssets: [],
  gameAssets: [],
};

const createCharacterAtom = atom<ICreateCharacterAtom>(defaultState);

export const useCreateCharacterAtom = () => {
  const [character, setCharacter] = useAtom(createCharacterAtom);
  const resetCharacter = useCallback(() => {
    setCharacter(defaultState);
  }, [setCharacter]);

  return [character, setCharacter, resetCharacter] as const;
};
