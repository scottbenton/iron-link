import ironswornJson from "@datasworn/ironsworn-classic/json/classic.json";
import delveJson from "@datasworn/ironsworn-classic-delve/json/delve.json";
import starforgedJson from "@datasworn/starforged/json/starforged.json";
import sunderedIslesJson from "@datasworn/sundered-isles/json/sundered_isles.json";
import { Datasworn } from "@datasworn/core";

const ironsworn = ironswornJson as Datasworn.Ruleset;
const delve = delveJson as unknown as Datasworn.Expansion;
const starforged = starforgedJson as unknown as Datasworn.Ruleset;
const sunderedIsles = sunderedIslesJson as Datasworn.Expansion;

export const defaultBaseRulesets: Record<string, Datasworn.Ruleset> = {
  [ironsworn._id]: ironsworn as Datasworn.Ruleset,
  [starforged._id]: starforged as unknown as Datasworn.Ruleset,
};

export const defaultExpansions: Record<
  string,
  Record<string, Datasworn.Expansion>
> = {
  [ironsworn._id]: {
    [delve._id]: delve as unknown as Datasworn.Expansion,
  },
  [starforged._id]: {
    [sunderedIsles._id]: sunderedIsles as Datasworn.Expansion,
  },
};

export const allDefaultPackages: Record<string, Datasworn.RulesPackage> = {
  [ironsworn._id]: ironsworn,
  [starforged._id]: starforged,
  [delve._id]: delve,
  [sunderedIsles._id]: sunderedIsles,
};
