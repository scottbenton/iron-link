import { Datasworn, IdParser } from "@datasworn/core";
import { useEffect } from "react";

export interface DataswornConfig {
  rulesets: [Datasworn.Ruleset, ...Datasworn.Ruleset[]];
  expansions?: Datasworn.Expansion[];
}

export function useSyncDataswornRulesets(config: DataswornConfig) {
  const { rulesets, expansions } = config;
  useEffect(() => {
    const tree: Record<string, Datasworn.RulesPackage> = {};
    rulesets.forEach((ruleset) => {
      tree[ruleset._id] = ruleset;
    });
    expansions?.forEach((expansion) => {
      tree[expansion._id] = expansion;
    });

    IdParser.tree = tree;
  }, [rulesets, expansions]);
}
