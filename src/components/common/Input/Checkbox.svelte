<script lang="ts">
	import { createCheckbox, createSync, melt } from '@melt-ui/svelte';
	import CheckIcon from 'virtual:icons/tabler/check';

	export let id: string;
	export let label: string;
	export let checked: boolean;
	export let disabled: boolean = false;
	export let ariaControls: string | undefined = undefined;

	export let onChecked: (checked: boolean) => void = () => {};

	const {
		elements: { root, input },
		helpers: { isChecked, isIndeterminate },
		states,
		options
	} = createCheckbox({
		defaultChecked: checked
	});

	const sync = createSync(states);
	$: sync.checked(checked, (v) => {
		let newValue = v === 'indeterminate' ? false : v;
		checked = newValue;
		onChecked(newValue);
	});
	const optionSync = createSync(options);
	$: optionSync.disabled(disabled, (v) => {
		disabled = v;
	});
</script>

<div class="checkbox-container">
	<button use:melt={$root} {id} class:checked={$isChecked} aria-controls={ariaControls}>
		{#if $isChecked}
			<CheckIcon width={'24px'} height={'24px'} style={'font-size:1.25rem'} />
		{/if}
		<input use:melt={$input} />
	</button>
	<label class="pl-4 font-medium text-magnum-900" for={id}>
		{label}
	</label>
</div>

<style lang="scss">
	.checkbox-container {
		display: flex;
		align-items: center;
		padding-top: $space-1;
		padding-bottom: $space-1;

		button {
			&[data-state='checked'] {
				border-color: $primary-700;
				background: $primary-gradient-linear;
				background-color: $primary-600;
			}
			padding: 0;
			display: flex;
			width: $space-6;
			height: $space-6;
			appearance: none;
			align-items: center;
			justify-content: stretch;
			border-radius: $space-2;
			background-color: $background-default;
			color: #fff;
			border: 2px solid $gray-400;
			&:hover:not(:disabled) {
				background-color: $background-hover;
			}
			cursor: pointer;
			&:disabled {
				cursor: default;
				border-color: $divider-disabled;
				&[data-state='checked'] {
					background-color: $background-disabled;
				}
			}
		}

		label {
			padding-left: $space-2;
			color: $text-primary;
			cursor: pointer;
		}
		button:disabled + label {
			color: $text-secondary;
			cursor: default;
		}
	}
</style>
