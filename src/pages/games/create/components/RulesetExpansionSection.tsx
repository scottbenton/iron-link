import { RulesPackageSelector } from "components/datasworn/RulesPackageSelector";
import { useSetCreateGameAtom, createGameAtom } from "../atoms/createGame.atom";
import { derivedAtomWithEquality } from "atoms/derivedAtomWithEquality";
import { useAtomValue } from "jotai";
import { SectionHeading } from "components/SectionHeading";
import { useTranslation } from "react-i18next";

const rulesPackages = derivedAtomWithEquality(createGameAtom, (atom) => ({
  rulesets: atom.rulesets,
  expansions: atom.expansions,
}));

export function RulesetExpansionSection() {
  const { t } = useTranslation();

  const setCreateGame = useSetCreateGameAtom();
  const { rulesets, expansions } = useAtomValue(rulesPackages);

  const handleRulesetChange = (rulesetKey: string, isActive: boolean) => {
    setCreateGame((prev) => ({
      ...prev,
      rulesets: {
        ...prev.rulesets,
        [rulesetKey]: isActive,
      },
    }));
  };

  const handleExpansionChange = (
    rulesetKey: string,
    expansionKey: string,
    isActive: boolean
  ) => {
    setCreateGame((prev) => ({
      ...prev,
      expansions: {
        ...prev.expansions,
        [rulesetKey]: {
          ...prev.expansions[rulesetKey],
          [expansionKey]: isActive,
        },
      },
    }));
  };

  return (
    <>
      <SectionHeading
        label={t("game.create.choose-ruleset-heading", "Choose your Rules")}
        breakContainer
      />
      <RulesPackageSelector
        sx={{ mt: 1 }}
        activeRulesetConfig={rulesets}
        activeExpansionConfig={expansions}
        onRulesetChange={handleRulesetChange}
        onExpansionChange={handleExpansionChange}
      />
    </>
  );
}
