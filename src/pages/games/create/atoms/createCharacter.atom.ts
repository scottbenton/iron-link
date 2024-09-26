import { AssetDocument } from "api-calls/assets/_asset.type";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

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
  assets: AssetDocument[];
}

const defaultState: ICreateCharacterAtom = {
  name: "",
  portrait: undefined,
  stats: {},
  assets: [],
};

const createCharacterAtom = atom<ICreateCharacterAtom>(defaultState);

export const useCreateCharacterAtom = () => {
  const [character, setCharacter] = useAtom(createCharacterAtom);
  const resetCharacter = useCallback(() => {
    setCharacter(defaultState);
  }, [setCharacter]);

  return [character, setCharacter, resetCharacter] as const;
};
