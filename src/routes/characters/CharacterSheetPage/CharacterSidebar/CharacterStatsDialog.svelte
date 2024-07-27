<script lang="ts">
	import Button from '$components/common/Button.svelte';
	import Dialog from '$components/common/Dialog/Dialog.svelte';
	import DebouncedNumberMeter from '$components/datasworn/Rollers/DebouncedNumberMeter.svelte';
	import NumberMeter from '$components/datasworn/Rollers/NumberMeter.svelte';
	import { stats } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import { onDestroy } from 'svelte';

	export let open: boolean = false;
	export let character: RxDocument<CharacterType>;

	$: statValues = {} as Record<string, number>;

	$: subscription = character.stats$?.subscribe((newStats) => {
		statValues = { ...newStats };
	});
	onDestroy(() => {
		subscription?.unsubscribe();
	});

	function updateStat(key: string, value: number) {
		character.incrementalModify((char) => {
			char.stats = char.stats ?? {};
			char.stats[key] = value;
			return char;
		});
	}
</script>

<Dialog bind:open title={$i18n.t('characterSheet.characterStatsDialogHeader')}>
	{#if Object.keys($stats).length > 0}
		<div>
			<span class="text-sm label">{$i18n.t('characters.statsLabel')}</span>
			<div class="stat-grid">
				{#each Object.keys($stats) as statId}
					<DebouncedNumberMeter
						min={-9}
						max={9}
						label={$stats[statId].label}
						value={statValues[statId]}
						onChange={(newValue) => updateStat(statId, newValue)}
					/>
				{/each}
			</div>
		</div>
	{/if}
	<svelte:fragment slot="actions" let:closeDialog>
		<Button variant="primary" onClick={closeDialog}>{$i18n.t('shared.done')}</Button>
	</svelte:fragment>
</Dialog>

<style lang="scss">
	.label {
		font-weight: 600;
		color: $text-secondary;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 130px);
		gap: $space-2;
	}
</style>
