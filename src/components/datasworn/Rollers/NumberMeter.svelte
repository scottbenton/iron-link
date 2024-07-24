<script lang="ts">
	import IconButton from '$components/IconButton.svelte';
	import { announcer } from '$lib/stores/announcer.store';
	import MinusIcon from 'virtual:icons/tabler/minus';
	import PlusIcon from 'virtual:icons/tabler/plus';
	import { i18n } from '$lib/i18n';
	import RollerBox from './RollerBox.svelte';
	import RollerInnerButton from './RollerInnerButton.svelte';

	export let label: string;
	export let value: number = 0;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let actionType: 'reset' | 'roll' | undefined = undefined;

	$: localValue = value ?? 0;

	export let onActionClick: (() => void) | undefined = undefined;

	const handleDecrement = () => {
		if (localValue === min) return;
		value = localValue - 1;
		$announcer = $i18n.t('shared.meterDecrementNotification', { label, value });
	};
	const handleIncrement = () => {
		if (localValue === max) return;
		value = localValue + 1;
		$announcer = $i18n.t('shared.meterIncrementNotification', { label, value });
	};
</script>

<RollerBox {label}>
	<div class="meter-actions">
		<IconButton
			disabled={localValue === min}
			onClick={handleDecrement}
			label={$i18n.t('shared.meterDecrement', { label })}
		>
			<MinusIcon style={'font-size: 1.25rem'} />
		</IconButton>
		<RollerInnerButton {value} onClick={onActionClick} {actionType} />
		<IconButton
			disabled={localValue === max}
			onClick={handleIncrement}
			label={$i18n.t('shared.meterIncrement', { label })}
		>
			<PlusIcon style={'font-size: 1.25rem'} />
		</IconButton>
	</div>
</RollerBox>

<style lang="scss">
	.meter-actions {
		display: flex;
		align-items: stretch;
	}
</style>
