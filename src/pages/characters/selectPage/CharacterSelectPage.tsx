import { useUsersCharacters } from "atoms/users.characters";
import { GradientButton } from "components/GradientButton";
import { PageContent, PageHeader } from "components/Layout";
import { GridLayout } from "components/Layout/GridLayout";
import { useTranslation } from "react-i18next";

export function CharacterSelectPage() {
  const { t } = useTranslation();
  const characterState = useUsersCharacters();

  return (
    <>
      <PageHeader
        label={t("Your Characters")}
        actions={<GradientButton>{t("Add Character")}</GradientButton>}
      />
      <PageContent>
        <GridLayout
          items={Object.values(characterState.characters)}
          renderItem={(character) => <div>{character.name}</div>}
          loading={characterState.loading}
          error={characterState.error}
          emptyStateMessage={t("No characters found")}
          emptyStateAction={
            <GradientButton>{t("Add Character")}</GradientButton>
          }
          minWidth={200}
        />
      </PageContent>
    </>
  );
}
