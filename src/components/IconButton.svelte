<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import type { Action } from 'svelte/action';
	type SomeBuilder<Element, Param, Attributes extends Record<string, any>> = Record<string, any> & {
		action: Action<Element, Param, Attributes>;
	};

	export let onClick: (() => void) | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let label: string;
	export let disabled = false;
	export let meltAction: SomeBuilder<HTMLButtonElement, never, Record<string, any>> | undefined =
		undefined;
	// TODO - add support for automatically adding a tooltip based on the aria-label attribute
</script>

<button
	{type}
	{disabled}
	class="icon-button"
	aria-label={label}
	on:click={() => onClick && onClick()}
	use:melt={meltAction ?? { action: () => ({ destroy: () => {} }) }}
>
	<slot />
</button>

<style lang="scss">
	.icon-button {
		flex-shrink: 0;
		background-color: transparent;
		border: none;
		cursor: pointer;
		display: inline-block;
		padding: $space-2;
		border-radius: $border-radius;
		transition: background-color 150ms;
		transition-timing-function: ease-in-out;
		color: inherit;
		&:not(:disabled):hover {
			background-color: $background-hover;
		}
		&:disabled {
			color: $text-tertiary;
			cursor: unset;
		}
	}
</style>
