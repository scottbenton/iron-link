import ironsworn from '@datasworn/ironsworn-classic/json/classic.json';
import delve from '@datasworn/ironsworn-classic-delve/json/delve.json';
import starforged from '@datasworn/starforged/json/starforged.json';
import sunderedIsles from '@datasworn/sundered_isles/json/sundered_isles.json';
import { IdParser, mergeExpansion, type Datasworn } from '@datasworn/core';
import { derived, writable } from 'svelte/store';
import type { Ruleset } from '@datasworn/core/dist/Datasworn';

export const defaultRulesets: { name: string; ruleset: Ruleset }[] = [
	{ name: 'Ironsworn', ruleset: ironsworn as Datasworn.Ruleset },
	{ name: 'Starforged', ruleset: starforged as unknown as Datasworn.Ruleset }
];

const rulesetMap: Record<string, Datasworn.Ruleset> = {
	[ironsworn._id]: ironsworn as Datasworn.Ruleset,
	[starforged._id]: starforged as unknown as Datasworn.Ruleset
};

export const defaultExpansions: Record<string, Record<string, Datasworn.Expansion>> = {
	[ironsworn._id]: {
		[delve._id]: delve as unknown as Datasworn.Expansion
	},
	[starforged._id]: {
		[sunderedIsles._id]: sunderedIsles as Datasworn.Expansion
	}
};

export const activeRulesets = writable<{
	rulesetIds: Record<string, boolean>;
	expansionIds: Record<string, Record<string, boolean>>;
}>({ rulesetIds: {}, expansionIds: {} });

export const rulesets = derived(activeRulesets, ({ rulesetIds, expansionIds }) => {
	const newRulesets: Ruleset[] = [];

	Object.keys(rulesetIds)
		.filter((rid) => rulesetIds[rid])
		.forEach((id) => {
			let ruleset = deepCopy(rulesetMap[id]);
			if (expansionIds[id]) {
				Object.keys(expansionIds[id] ?? {})
					.filter((eid) => expansionIds[id][eid])
					.forEach((expansionId) => {
						ruleset = mergeExpansion(ruleset, deepCopy(defaultExpansions[id][expansionId]));
					});
			}

			newRulesets.push(ruleset);
		});

	return newRulesets;
});

export const isIronswornActive = derived(activeRulesets, ($activeRulesets) => {
	return $activeRulesets.rulesetIds[ironsworn._id];
});

export const isStarforgedActive = derived(activeRulesets, ($activeRulesets) => {
	return $activeRulesets.rulesetIds[starforged._id];
});

function deepCopy<T = Datasworn.Ruleset | Datasworn.Expansion>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

export const parser = derived(rulesets, ($rulesets) => {
	const newRulesetMap: Record<string, Datasworn.Ruleset> = {};
	$rulesets.forEach((ruleset) => {
		newRulesetMap[ruleset._id] = ruleset;
	});
	IdParser.tree = newRulesetMap;
	return IdParser;
});

export const stats = derived(rulesets, ($rulesets) => {
	const stats: Record<string, Datasworn.StatRule> = $rulesets.reduce((acc, ruleset) => {
		if (ruleset.rules.stats) {
			acc = { ...acc, ...ruleset.rules.stats };
		}
		return acc;
	}, {});
	return stats;
});

export const conditionMeters = derived(rulesets, ($rulesets) => {
	const conditionMeters: Record<string, Datasworn.ConditionMeterRule> = $rulesets.reduce(
		(acc, ruleset) => {
			if (ruleset.rules.condition_meters) {
				acc = { ...acc, ...ruleset.rules.condition_meters };
			}
			return acc;
		},
		{}
	);
	return conditionMeters;
});

export const impacts = derived(rulesets, ($rulesets) => {
	const impactCategories: Record<string, Datasworn.ImpactCategory> = {};
	const impacts: Record<string, Datasworn.ImpactRule> = {};

	$rulesets.forEach((ruleset) => {
		Object.keys(ruleset.rules.impacts).forEach((impactCategoryKey) => {
			impactCategories[impactCategoryKey] = ruleset.rules.impacts[impactCategoryKey];
			Object.keys(ruleset.rules.impacts[impactCategoryKey].contents).forEach((impactKey) => {
				impacts[impactKey] = ruleset.rules.impacts[impactCategoryKey].contents[impactKey];
			});
		});
	});

	return { impactCategories, impacts };
});

export const specialTracks = derived(rulesets, ($rulesets) => {
	const specialTracks: Record<string, Datasworn.SpecialTrackRule> = $rulesets.reduce(
		(acc, ruleset) => {
			if (ruleset.rules.special_tracks) {
				acc = { ...acc, ...ruleset.rules.special_tracks };
			}
			return acc;
		},
		{}
	);
	return specialTracks;
});
