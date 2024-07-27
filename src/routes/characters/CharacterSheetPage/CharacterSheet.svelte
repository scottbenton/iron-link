<script lang="ts">
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import PageLayout from '$components/Layout/PageLayout.svelte';
	import CharacterSidebar from './CharacterSidebar/CharacterSidebar.svelte';
	import type { RxDocument } from 'rxdb';
	import Button from '$components/common/Button.svelte';
	import { sidebarStore } from '$lib/stores/sidebar.store';
	import { activeRulesets } from '$lib/datasworn/rules';
	import { onDestroy } from 'svelte';
	import { ColorScheme, colorSchemes, themeStore } from '$lib/stores/theme.store';

	export let character: RxDocument<CharacterType>;
	$: rulesetSubscription = character.rulesetIds$.subscribe((rulesetIds) => {
		let activeRulesets: Record<string, boolean> = {};

		rulesetIds.forEach((rulesetId) => {
			activeRulesets[rulesetId] = true;
		});
		$activeRulesets.rulesetIds = activeRulesets;
	});
	$: expansionSubscription = character.expansionIds$?.subscribe((expansionIds) => {
		let activeExpansions: Record<string, Record<string, boolean>> = {};

		const typedExpansionIds = expansionIds as Record<string, string[]> | undefined;
		if (typedExpansionIds) {
			Object.keys(typedExpansionIds).forEach((rulesetId) => {
				activeExpansions[rulesetId] = {};
				typedExpansionIds[rulesetId].forEach((expansionId) => {
					activeExpansions[rulesetId][expansionId] = true;
				});
			});
		}
		$activeRulesets.expansionIds = activeExpansions;
	});
	$: colorSchemeSubscription = character.theme$?.subscribe((theme) => {
		if (theme && colorSchemes.includes(theme as ColorScheme)) {
			$themeStore.colorScheme = theme as ColorScheme;
		} else {
			$themeStore.colorScheme = ColorScheme.Default;
		}
	});

	onDestroy(() => {
		rulesetSubscription?.unsubscribe();
		expansionSubscription?.unsubscribe();
		colorSchemeSubscription?.unsubscribe();
		$themeStore.colorScheme = ColorScheme.Default;
	});
</script>

<PageLayout maxHeightScreen>
	<svelte:fragment slot="sidebar-left">
		<CharacterSidebar {character} />
	</svelte:fragment>
	<div>
		<span class="sidebar-left-button-container">
			<Button variant="secondary" onClick={() => ($sidebarStore.left = true)}>
				Open Character
			</Button>
		</span>
		<span>Notes</span>
		<span class="sidebar-right-button-container">
			<Button variant="secondary" onClick={() => ($sidebarStore.right = true)}>Open Moves</Button>
		</span>
	</div>
	<div></div>
	<svelte:fragment slot="sidebar-right">
		<div class="sidebar">Moves & Oracles</div>
	</svelte:fragment>
</PageLayout>

<style lang="scss">
	.sidebar {
		// width: 350px; // todo - work out how to make this responsive
		overflow: auto;
	}
	@media (min-width: $breakpoint-lg) {
		.sidebar-left-button-container {
			display: none;
		}
	}
	@media (min-width: $breakpoint-xl) {
		.sidebar-right-button-container {
			display: none;
		}
	}
</style>
