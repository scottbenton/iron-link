<script lang="ts">
	import SelectInput from '$components/common/Input/SelectInput.svelte';
	import { isStarforgedActive } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';

	const defaultInitiativeStatus: CharacterType['initiativeStatus'] = 'outOfCombat';

	export let character: RxDocument<CharacterType>;

	$: initiativeStatus = character.initiativeStatus;
	$: character.initiativeStatus$?.subscribe((newInitiativeStatus) => {
		initiativeStatus = newInitiativeStatus;
	});

	$: status = (initiativeStatus ?? defaultInitiativeStatus) as Exclude<
		CharacterType['initiativeStatus'],
		undefined
	>;

	function onInitiativeStatusChange(value: string) {
		if (value !== status) {
			status = value as Exclude<CharacterType['initiativeStatus'], undefined>;

			character.incrementalPatch({ initiativeStatus: status }).catch(() => {
				console.error('Failed to patch initiative status');
			});
		}
	}

	$: labels = {
		outOfCombat: $i18n.t('characterSheet.initiative.outOfCombat'),
		initiative: $isStarforgedActive
			? $i18n.t('characterSheet.initiative.hasInitiativeStarforged')
			: $i18n.t('characterSheet.initiative.hasInitiative'),
		noInitiative: $isStarforgedActive
			? $i18n.t('characterSheet.initiative.noInitiativeStarforged')
			: $i18n.t('characterSheet.initiative.noInitiative')
	};
</script>

<div class={`initiative-buttons ${status}`}>
	<SelectInput
		label={$i18n.t('characterSheet.initiative.label')}
		isLabelSROnly
		value={{
			value: status,
			label: labels[status]
		}}
		onValueChange={(value) => value && onInitiativeStatusChange(value)}
		options={[
			{
				value: 'outOfCombat',
				label: labels.outOfCombat
			},
			{
				value: 'initiative',
				label: labels.initiative
			},
			{
				value: 'noInitiative',
				label: labels.noInitiative
			}
		]}
	/>
</div>

<style lang="scss">
	:global(div.initiative-buttons .input-container .input-box) {
		justify-content: space-between;
		border-width: 0px;
		background-color: $gray-700;
		color: #fff;
		margin-top: $space-1;
	}
	:global(div.initiative-buttons.initiative .input-container .input-box) {
		background-color: $success-800;
	}
	:global(div.initiative-buttons.noInitiative .input-container .input-box) {
		background-color: $error-800;
	}

	:global(div.initiative-buttons .input-container .input-box .input) {
		padding: 0px $space-2;
		color: #fff;
		font-size: $text-sm;
		text-align: left;
	}
	:global(div.initiative-buttons .input-container .input-box .arrow) {
		color: #fff;
	}
	:global(div.initiative-buttons .menu) {
		min-width: 200px;
	}
</style>
