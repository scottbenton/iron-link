<script lang="ts">
	import DebouncedNumberMeter from '$components/datasworn/Rollers/DebouncedNumberMeter.svelte';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import { onDestroy } from 'svelte';

	export let character: RxDocument<CharacterType>;

	$: debilities = character.debilities ?? {};
	$: momentum = character.momentum ?? 2;
	$: adds = character.adds ?? 0;

	$: debilitiesSubscription = character.debilities$?.subscribe((newDebilities) => {
		debilities = newDebilities ?? {};
	});
	$: momentumSubscription = character.momentum$?.subscribe((newMomentum) => {
		momentum = newMomentum ?? 2;
	});
	$: addsSubscription = character.adds$?.subscribe((newAdds) => {
		adds = newAdds ?? 0;
	});

	onDestroy(() => {
		debilitiesSubscription?.unsubscribe();
		momentumSubscription?.unsubscribe();
		addsSubscription?.unsubscribe();
	});

	$: momentumResetValue = 2;

	$: {
		let count = 0;
		Object.keys(debilities).forEach((debility) => {
			if (debilities[debility]) {
				count++;
			}
		});
		if (count === 0) {
			momentumResetValue = 2;
		} else if (count === 1) {
			momentumResetValue = 1;
		} else {
			momentumResetValue = 0;
		}
	}

	function handleUpdateMomentum(value: number) {
		character
			.incrementalPatch({
				momentum: value
			})
			.catch(() => {});
	}
	function handleUpdateAdds(value: number) {
		character
			.incrementalPatch({
				adds: value
			})
			.catch(() => {});
	}
	// Todo - add notification on resets
</script>

<div class="meters-section">
	<h2 class="text-xl font-title">{$i18n.t('characterSheet.rollAffectsHeader')}</h2>
	<div class="meters-grid">
		<DebouncedNumberMeter
			label={$i18n.t('characterSheet.momentumLabel')}
			value={momentum}
			min={-6}
			max={10}
			actionType={'reset'}
			onChange={(value) => handleUpdateMomentum(value)}
			onActionClick={() => handleUpdateMomentum(momentumResetValue)}
		/>
		<DebouncedNumberMeter
			label={$i18n.t('characterSheet.addsLabel')}
			value={adds}
			min={0}
			max={10}
			onChange={(value) => handleUpdateAdds(value)}
			onActionClick={() => handleUpdateAdds(0)}
			actionType={'reset'}
		/>
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
