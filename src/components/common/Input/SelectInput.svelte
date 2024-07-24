<script lang="ts">
	import { createSelect, melt } from '@melt-ui/svelte';
	import { fade } from 'svelte/transition';
	import ChevronDown from 'virtual:icons/tabler/chevron-down';
	import Check from 'virtual:icons/tabler/check';

	export let label: string;
	export let isLabelSROnly: boolean = false;
	export let options: { value: string; label: string }[] = [];

	export let value: { value: string; label: string } | undefined = undefined;
	export let onValueChange: (value: string | undefined) => void;

	const {
		elements: { trigger, menu, option, label: labelElement },
		states: { selectedLabel, selected, open },
		helpers: { isSelected }
	} = createSelect<string>({
		onSelectedChange: (value) => {
			onValueChange(value.next?.value);
			return value.next;
		},
		forceVisible: true,
		positioning: {
			placement: 'bottom-start',
			fitViewport: true,
			sameWidth: false
		}
	});

	$: selected.set(value);
</script>

<div class="input-container">
	<!-- svelte-ignore a11y-label-has-associated-control - $label contains the 'for' attribute -->
	<label class="text-sm" class:screen-reader-only={isLabelSROnly} use:melt={$labelElement}>
		{label}
	</label>
	<button class="input-box text-base" use:melt={$trigger} aria-label={label}>
		<div class="input">
			{$selectedLabel || label}
		</div>
		<div class="arrow">
			<ChevronDown />
		</div>
	</button>
	{#if $open}
		<div class="menu" use:melt={$menu} transition:fade={{ duration: 150 }}>
			{#each Object.values(options) as { value, label }}
				<div class="option" use:melt={$option({ value, label })}>
					<div class="contents">
						{label}
					</div>
					<div class="check {$isSelected(value) ? 'block' : 'hidden'}">
						<Check />
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.menu {
		background-color: $background-default;
		color: $text-secondary;
		border: 1px solid $divider;
		border-radius: $border-radius;
		padding: $space-2 0;
	}
	.option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $space-2 $space-4;
		cursor: pointer;
		transition: background-color 150ms ease-in-out;

		&:hover {
			background-color: $background-hover;
		}
		&[data-highlighted] {
			background-color: $background-hover;
		}

		.check {
			margin-left: $space-2;
			color: $primary-500;
		}
		.block {
			display: block;
		}
		.hidden {
			display: none;
		}
	}
	.input-container {
		label {
			font-weight: 600;
			color: $text-secondary;
		}
	}
	.input-container.error {
		label {
			color: $error-600;
		}
		.input-box {
			border-color: $error-600;
		}
		.helper-text {
			color: $error-600;
		}
	}
	:global(.input-container.error) {
		label {
			color: $error-500;
		}
		.input-box {
			border-color: $error-500;
		}
		.helper-text {
			color: $error-500;
		}
	}
	.helper-text {
		margin-top: $space-1;
		color: $text-secondary;
	}
	.input-box {
		display: flex;
		align-items: center;
		border: 1px solid $divider;
		border-radius: $border-radius;

		transition-property: border-color;
		transition-duration: 150ms;
		transition-timing-function: ease-in-out;

		cursor: pointer;
		background-color: $background-default;

		.input {
			color: $text-primary;
			padding: $space-3 $space-4;
			flex-grow: 1;
			border: none;
			background: transparent;
			outline: none;
		}

		.arrow {
			padding-right: $space-2;
			color: $text-tertiary;

			flex-shrink: 0;
		}

		&:focus-within {
			border-color: $primary-500;
		}
	}
</style>
