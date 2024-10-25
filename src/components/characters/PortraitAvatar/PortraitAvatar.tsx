import {
  useCharacterPortrait,
  useLoadCharacterPortrait,
} from "atoms/characterPortraits.atom";
import {
  AvatarSizes,
  PortraitAvatarDisplay,
} from "components/characters/PortraitAvatar/PortraitAvatarDisplay";

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
    />
  );
}
