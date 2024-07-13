<script lang="ts">
	import { announcer } from '$lib/stores/announcer.store';
	import MinusIcon from 'virtual:icons/tabler/minus';
	import PlusIcon from 'virtual:icons/tabler/plus';

	export let label: string;
	export let value: number = 0;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;

	$: localValue = value ?? 0;

	export let onClick: (() => void) | undefined = undefined;

	const handleDecrement = () => {
		if (localValue === min) return;
		value = localValue - 1;
		$announcer = `Decremented ${label} to ${value}`;
	};
	const handleIncrement = () => {
		if (localValue === max) return;
		value = localValue + 1;
		$announcer = `Incremented ${label} to ${value}`;
	};
</script>

<div class="number-meter">
	<span class="label text-base font-title">{label}</span>
	<div class="meter-actions">
		<button
			class="icon-button"
			disabled={localValue === min}
			on:click={handleDecrement}
			aria-label={`Decrement ${label}`}><MinusIcon style={'font-size: 1.25rem'} /></button
		>
		{#if onClick === undefined}
			<span class="value font-title text-xl">{localValue >= 0 ? '+' : '-'}{localValue}</span>
		{:else}
			<button class="value font-title text-xl" on:click={() => onClick()}
				>{localValue >= 0 ? '+' : '-'}{localValue}</button
			>
		{/if}
		<button
			class="icon-button"
			disabled={localValue === max}
			on:click={handleIncrement}
			aria-label={`Increment ${label}`}><PlusIcon style={'font-size: 1.25rem'} /></button
		>
	</div>
</div>

<style lang="scss">
	.number-meter {
		background-color: $gray-300;
		border-radius: $border-radius;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: $space-1 0;

		.meter-actions {
			display: flex;
			align-items: stretch;
			color: $text-secondary;
		}
		.label {
			padding-left: $space-1;
			padding-right: $space-1;
			color: $text-secondary;
		}
		.value {
			border-radius: $border-radius;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-grow: 1;
			background-color: $gray-700;
			color: #fff;
			width: 50px;
		}
	}
</style>
