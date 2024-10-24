import { useEffect, useState } from "react";
import { ButtonBase } from "@mui/material";

import { PortraitAvatarDisplay } from "components/characters/PortraitAvatar";
import { PortraitUploaderDialog } from "components/PortraitUploaderDialog";
import {
  ICreateCharacterAtom,
  useCreateCharacterAtom,
} from "pages/games/create/atoms/createCharacter.atom";

export interface ImageInputProps {
  value: ICreateCharacterAtom["portrait"];
  onChange: (value: ICreateCharacterAtom["portrait"]) => void;
}

export function ImageInput(props: ImageInputProps) {
  const { value, onChange } = props;

  const name = useCreateCharacterAtom()[0].name;

  const [dialogOpen, setDialogOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>();

  const file = value?.image;
  useEffect(() => {
    if (file && typeof file !== "string") {
      const reader = new FileReader();

      // Set up a function to run when the file is loaded
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Set the src attribute of the img element to the loaded image data
        const src = e.target?.result;
        if (typeof src === "string") {
          setImageUrl(src);
        }
      };

      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div>
      <ButtonBase
        aria-label={"Upload a Character Portrait"}
        sx={(theme) => ({
          borderRadius: `${theme.shape.borderRadius}px`,
        })}
        onClick={() => setDialogOpen(true)}
      >
        <PortraitAvatarDisplay
          colorful
          size={"large"}
          name={name}
          portraitUrl={imageUrl}
          portraitSettings={
            value?.position && value?.scale !== undefined
              ? {
                  position: value.position,
                  scale: value.scale,
                }
              : undefined
          }
        />
      </ButtonBase>
      <PortraitUploaderDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        handleUpload={(image, scale, position) => {
          onChange({
            image,
            scale,
            position,
          });
          return new Promise<void>((res) => res());
        }}
        existingPortraitFile={undefined}
        existingPortraitSettings={undefined}
      />
    </div>
  );
}
