import { SectionHeading } from "components/SectionHeading";
import { useTranslation } from "react-i18next";
import { CharacterDetails } from "./CharacterDetails";
import { Stats } from "./Stats";
import { Assets } from "./Assets";

export function CreateCharacter() {
  const { t } = useTranslation();
  return (
    <>
      <SectionHeading breakContainer rounded label={t("Character Details")} />
      <CharacterDetails />
      <SectionHeading
        breakContainer
        rounded
        label={t("Character Stats")}
        sx={{ mt: 3 }}
      />
      <Stats />
      <SectionHeading
        breakContainer
        rounded
        label={t("Assets")}
        sx={{ mt: 3 }}
      />
      <Assets />
    </>
  );
}
