<script lang="ts">
	import IconButton from '$components/IconButton.svelte';
	import ProgressTrackTick from './ProgressTrackTick.svelte';
	import PlusIcon from 'virtual:icons/tabler/plus';
	import MinusIcon from 'virtual:icons/tabler/minus';
	import { announcer } from '$lib/stores/announcer.store';
	import { i18n } from '$lib/i18n';

	export let label: string;
	export let description: string | undefined = undefined;
	export let value: number = 0;

	export let step: number = 1;

	export let onChange: ((value: number) => void) | undefined = undefined;

	const MIN = 0;
	const MAX = 40;

	$: checks = [] as number[];

	$: {
		checks = [];
		let checksIndex = 0;
		let checksValue = 0;

		for (let i = MIN; i <= MAX; i++) {
			if (i % 4 === 0 && i !== 0) {
				checks[checksIndex] = checksValue;
				checksIndex++;
				checksValue = 0;
			}

			if (i < value) {
				checksValue++;
			}
		}
	}

	function getValueText(val: number) {
		return $i18n.t('shared.progressValue', { ticks: val, boxes: Math.floor(val / 4) });
	}

	function decrement() {
		if (onChange) {
			let newValue = Math.max(MIN, value - step);
			$announcer = $i18n.t('shared.meterDecrementNotification', {
				label,
				value: getValueText(newValue)
			});
			onChange(newValue);
		}
	}
	function increment() {
		if (onChange) {
			let newValue = Math.min(MAX, value + step);
			$announcer = $i18n.t('shared.meterIncrementNotification', {
				label,
				value: getValueText(newValue)
			});
			onChange(newValue);
		}
	}

	$: ariaLabelText = getValueText(value);
</script>

<div class="progress-track">
	<div class="header">
		<span class="font-title text-lg" id={`${label}-label`}>
			{label}
		</span>
	</div>
	{#if description}
		<p class="description">
			{description}
		</p>
	{/if}
	<div class="ticks" aria-label={ariaLabelText}>
		{#each checks as ticks}
			<div>
				<ProgressTrackTick value={ticks} />
			</div>
		{/each}
	</div>
	<div class="actions">
		<div>
			<slot name="actions" />
		</div>
		{#if onChange}
			<div>
				<IconButton label={$i18n.t('shared.meterDecrement', { label })} onClick={() => decrement()}>
					<MinusIcon />
				</IconButton><IconButton
					label={$i18n.t('shared.meterIncrement', { label })}
					onClick={() => increment()}
				>
					<PlusIcon />
				</IconButton>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.progress-track {
		display: flex;
		flex-direction: column;
		align-items: start;
		width: 282px;
		.header {
			display: flex;
			align-self: stretch;
			justify-content: space-between;
		}
		.description {
			color: $text-secondary;
		}
		.actions {
			display: flex;
			align-self: stretch;
			justify-content: space-between;
			color: $text-secondary;
		}
	}
	.ticks {
		display: flex;
		flex-wrap: wrap;
		border: 1px solid $divider;
		border-radius: $border-radius;
		background-color: $background-default;
		color: $text-secondary;
		& > div {
			width: 28px;
			height: 28px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			&:not(:last-child) {
				border-right: 1px solid $divider;
			}
		}
	}
</style>
