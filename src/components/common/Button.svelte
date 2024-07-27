<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { link } from 'svelte-routing';
	import type { Action } from 'svelte/action';
	type SomeBuilder<Element, Param, Attributes extends Record<string, any>> = Record<string, any> & {
		action: Action<Element, Param, Attributes>;
	};

	export let variant: 'primary-gradient' | 'primary' | 'secondary' | 'text' = 'primary-gradient';
	export let dangerButton: boolean = false;
	export let href: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let isLabel: boolean = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';

	export let meltAction: SomeBuilder<HTMLButtonElement, never, Record<string, any>> | undefined =
		undefined;
</script>

{#if isLabel}
	<label class={`button ${variant} ${dangerButton ? 'danger' : ''}`} {...$$props}>
		<span class="content">
			<slot />
			{#if $$slots.endIcon}
				<span class="end-icon">
					<slot name="endIcon" />
				</span>
			{/if}
		</span>
	</label>
{:else if href}
	<a
		class={`button ${variant} ${dangerButton ? 'danger' : ''}`}
		{href}
		{...$$props}
		on:click={() => onClick && onClick()}
		use:link
		use:melt={meltAction ?? { action: () => ({ destroy: () => {} }) }}
	>
		<span class="content"
			><slot />
			{#if $$slots.endIcon}
				<span class="end-icon">
					<slot name="endIcon" />
				</span>
			{/if}
		</span>
	</a>
{:else}
	<button
		{type}
		class={`button ${variant} ${dangerButton ? 'danger' : ''}`}
		{...$$props}
		on:click={() => onClick && onClick()}
		use:melt={meltAction ?? { action: () => ({ destroy: () => {} }) }}
	>
		<span class="content">
			<slot />
			{#if $$slots.endIcon}
				<span class="end-icon">
					<slot name="endIcon" />
				</span>
			{/if}
		</span>
	</button>
{/if}

<style lang="scss">
	.button {
		text-decoration: none;
		border: none;
		padding: $space-2 $space-3;
		border-radius: $border-radius;
		font-weight: 600;
		background-color: transparent;
		border: none;
		color: $text-primary;
		cursor: pointer;

		transition-property: background-color padding margin;
		transition-duration: 150ms;
		transition-timing-function: ease-in-out;

		overflow: hidden;

		&:disabled {
			color: $text-tertiary;
			cursor: unset;
			.content .end-icon {
				color: $text-tertiary;
			}
		}

		.content {
			display: flex;
			align-items: center;
			justify-content: center;
			.end-icon {
				margin-left: $space-2;
				color: $text-secondary;
			}
		}

		&:not(:disabled):hover {
			background-color: $background-hover;
		}

		&.danger {
			color: $error-700;
			&:not(:disabled):hover {
				background-color: transparentize($color: $error-700, $amount: 0.1);
			}
		}
	}

	.button.primary-gradient {
		position: relative;
		z-index: 3;
		background-color: $gray-800;

		display: inline-block;
		padding: 2px;
		margin: -2px;
		border-radius: calc($border-radius + 2px);
		color: #fff;
		&:disabled {
			background-color: $gray-300;
			color: $gray-500;
			&::before {
				opacity: 0%;
			}
			.content {
				background-color: $gray-300;
				.end-icon {
					color: $gray-500;
				}
			}
		}
		&::before {
			content: '';
			display: block;
			position: absolute;
			z-index: 1;
			inset: -4px;
			margin: auto;
			aspect-ratio: 1;
			border-radius: inherit;
			background: $primary-gradient;

			opacity: 100%;

			animation: spin 4s linear infinite;
		}
		.content {
			z-index: 2;
			position: relative;
			border-radius: $border-radius;
			background-color: $gray-800;
			padding: $space-2 $space-3;

			.end-icon {
				color: $gray-200;
			}
		}

		&:not(:disabled):hover {
			padding: $space-1;
			margin: $-space-1;
			border-radius: calc($border-radius + $space-1);
		}
	}

	.button.primary {
		background: $primary-gradient-dark;
		background-color: $primary-700;
		position: relative;
		color: #fff;
		&.danger {
			background: $danger-gradient-dark;
		}
		&:disabled {
			background: none;
			background-color: $gray-300;
			color: $gray-500;
			&::before {
				opacity: 0%;
			}
			.content {
				.end-icon {
					color: $gray-500;
				}
			}
		}
		&:not(:disabled):hover {
			background-color: $primary-800;
			&::before {
				opacity: 20%;
			}
		}
		&::before {
			content: '';
			display: block;
			position: absolute;
			z-index: 0;
			inset: 0;
			background-color: $gray-900;
			transition-property: opacity;
			transition-duration: 150ms;
			transition-timing-function: ease-in-out;
			opacity: 0%;
		}
		.content {
			position: relative;
			z-index: 2;
		}

		.end-icon {
			color: #fff;
		}
	}

	.button.secondary {
		border: 1px solid $gray-500;
		&:disabled {
			border-color: $gray-200;
		}
	}
</style>
