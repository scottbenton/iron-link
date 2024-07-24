<script lang="ts">
	import NumberMeter from './NumberMeter.svelte';

	export let label: string;
	export let value: number = 0;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let onChange: (value: number) => void;
	export let actionType: 'reset' | 'roll' | undefined = undefined;
	export let onActionClick: (() => void) | undefined = undefined;

	let timer: NodeJS.Timeout;

	$: localValue = value ?? 0;

	const debounce = (newValue: number) => {
		clearTimeout(timer);
		if (newValue === value) return;

		timer = setTimeout(() => {
			onChange(newValue);
		}, 750);
	};

	$: {
		debounce(localValue);
	}
</script>

<NumberMeter {label} bind:value={localValue} {min} {max} {actionType} {onActionClick} />
