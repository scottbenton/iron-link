import { InitiativeStatus } from "api-calls/character/_character.type";
import { useDataswornTree } from "atoms/dataswornTree.atom";
import { starforgedId } from "data/datasworn.packages";
import { useTranslation } from "react-i18next";

export function useInitiativeStatusText(shortVariants?: boolean) {
  const { t } = useTranslation();

  const rulesets = useDataswornTree();
  if (rulesets[starforgedId]) {
    return {
      [InitiativeStatus.HasInitiative]: t("In Control"),
      [InitiativeStatus.DoesNotHaveInitiative]: t("In a Bad Spot"),
      [InitiativeStatus.OutOfCombat]: t("Out of Combat"),
    };
  } else {
    return {
      [InitiativeStatus.HasInitiative]: t("Has Initiative"),
      [InitiativeStatus.DoesNotHaveInitiative]: shortVariants
        ? t("No Initiative")
        : t("Does not have Initiative"),
      [InitiativeStatus.OutOfCombat]: t("Out of Combat"),
    };
  }
}
