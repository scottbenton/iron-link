import {
  AvatarSizes,
  PortraitAvatarDisplay,
} from "components/characters/PortraitAvatar/PortraitAvatarDisplay";

import {
  useCharacterPortrait,
  useLoadCharacterPortrait,
} from "stores/character.store";

import { ColorScheme } from "repositories/shared.types";

export interface PortraitAvatarProps {
  characterId: string;
  name?: string;
  portraitSettings?: {
    filename: string;
    position: {
      x: number;
      y: number;
    };
    scale: number;
  };
  size?: AvatarSizes;
  colorful?: boolean;
  rounded?: boolean;
  darkBorder?: boolean;
  colorSchemeBorder?: ColorScheme;
}

export function PortraitAvatar(props: PortraitAvatarProps) {
  const {
    characterId,
    name,
    portraitSettings,
    colorful,
    size,
    darkBorder,
    rounded,
    colorSchemeBorder,
  } = props;

  const filename = portraitSettings?.filename;
  useLoadCharacterPortrait(characterId, filename);
  const portraitUrl = useCharacterPortrait(characterId).url;

  return (
    <PortraitAvatarDisplay
      size={size}
      colorful={colorful}
      rounded={rounded}
      darkBorder={darkBorder}
      portraitSettings={portraitSettings}
      characterId={characterId}
      portraitUrl={portraitUrl}
      name={name}
      loading={!name}
      colorSchemeBorder={colorSchemeBorder}
    />
  );
}
