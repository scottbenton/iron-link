<script lang="ts">
	import DebouncedConditionMeter from '$components/datasworn/Rollers/DebouncedNumberMeter.svelte';
	import { conditionMeters } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import { onDestroy } from 'svelte';

	export let character: RxDocument<CharacterType>;

	$: conditionMeterValues = (character.conditionMeters as Record<string, number>) ?? {};
	$: conditionMeterSubscription = character.conditionMeters$?.subscribe((newMeters) => {
		conditionMeterValues = (newMeters as Record<string, number>) ?? {};
	});

	function handleUpdateConditionMeter(conditionMeterKey: string, value: number) {
		character.incrementalModify((doc) => {
			if (!doc.conditionMeters) {
				doc.conditionMeters = {};
			}
			doc.conditionMeters[conditionMeterKey] = value;
			return doc;
		});
	}

	onDestroy(() => {
		conditionMeterSubscription?.unsubscribe();
	});
</script>

<div class="meters-section">
	<h2 class="text-xl font-title">{$i18n.t('characterSheet.conditionMeterHeader')}</h2>
	<div class="meters-grid">
		{#each Object.entries($conditionMeters) as [conditionMeterKey, conditionMeter]}
			<DebouncedConditionMeter
				label={conditionMeter.label}
				value={conditionMeterValues[conditionMeterKey] ?? conditionMeter.value}
				min={conditionMeter.min}
				max={conditionMeter.max}
				onChange={(value) => handleUpdateConditionMeter(conditionMeterKey, value)}
				actionType={'roll'}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	.meters-section {
		margin-top: $space-4;
		.meters-grid {
			display: flex;
			flex-wrap: wrap;
			gap: $space-2;
			margin-top: $space-1;
		}
	}
</style>
