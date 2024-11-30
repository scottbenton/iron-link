import { Datasworn } from "@datasworn/core";
import delveJson from "@datasworn/ironsworn-classic-delve/json/delve.json";
import ironswornJson from "@datasworn/ironsworn-classic/json/classic.json";
import starforgedJson from "@datasworn/starforged/json/starforged.json";
import sunderedIslesJson from "@datasworn/sundered-isles/json/sundered_isles.json";

const ironsworn = { ...ironswornJson, title: "Ironsworn" } as Datasworn.Ruleset;
const delve = {
  ...delveJson,
  title: "Delve",
} as unknown as Datasworn.Expansion;
const starforged = {
  ...starforgedJson,
  title: "Starforged",
} as unknown as Datasworn.Ruleset;
const sunderedIsles = sunderedIslesJson as Datasworn.Expansion;

export const ironswornId = ironswornJson._id;
export const delveId = delveJson._id;
export const starforgedId = starforgedJson._id;
export const sunderedIslesId = sunderedIslesJson._id;

export const defaultBaseRulesets: Record<string, Datasworn.Ruleset> = {
  [ironsworn._id]: ironsworn as Datasworn.Ruleset,
  [starforged._id]: starforged as unknown as Datasworn.Ruleset,
};

export const defaultExpansions: Record<
  string,
  Record<string, Datasworn.Expansion>
> = {
  [ironsworn._id]: {
    [delve._id]: { ...delve, title: "Delve" } as unknown as Datasworn.Expansion,
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
