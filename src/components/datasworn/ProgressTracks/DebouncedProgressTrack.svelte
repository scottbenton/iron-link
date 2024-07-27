<script lang="ts">
	import ProgressTrack from './ProgressTrack.svelte';

	export let label: string;
	export let description: string | undefined = undefined;
	export let value: number = 0;

	export let step: number = 1;
	export let onChange: ((value: number) => void) | undefined = undefined;

	let timer: NodeJS.Timeout;

	$: localValue = value ?? 0;

	const debounce = (newValue: number) => {
		clearTimeout(timer);
		if (newValue === value || !onChange) return;

		timer = setTimeout(() => {
			onChange(newValue);
		}, 750);
	};

	$: {
		debounce(localValue);
	}
</script>

<ProgressTrack
	{label}
	{description}
	{step}
	value={localValue}
	onChange={onChange
		? (newValue) => {
				localValue = newValue;
				debounce(newValue);
			}
		: undefined}
>
	<svelte:fragment slot="actions">
		<slot name="actions" />
	</svelte:fragment>
</ProgressTrack>
