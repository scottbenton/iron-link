<script lang="ts">
	import Stat from '$components/datasworn/Rollers/Stat.svelte';
	import { stats } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';

	export let character: RxDocument<CharacterType>;

	$: statValues = character.stats as Record<string, number>;
	$: character.stats$?.subscribe((newStats) => {
		statValues = newStats as Record<string, number>;
	});
</script>

<div class="stats-section">
	<h2 class="text-xl font-title">{$i18n.t('characterSheet.statsHeader')}</h2>
	<div class="stat-grid">
		{#each Object.entries($stats) as [statKey, stat]}
			<Stat label={stat.label} value={statValues[statKey]} />
		{/each}
	</div>
</div>

<style lang="scss">
	.stats-section {
		margin-top: $space-4;
		.stat-grid {
			display: flex;
			flex-wrap: wrap;
			gap: $space-2;
			margin-top: $space-1;
		}
	}
</style>
