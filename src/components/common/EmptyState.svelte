<script lang="ts">
	import EmptyStateImage from '$assets/EmptyStateImage.svelte';

	export let size: 'sm' | 'md' = 'md';
	export let title: string;
	export let message: string;
	export let includeTopMargin: boolean = false;
</script>

<div class={`empty-state ${size}`} class:top-margin={includeTopMargin}>
	<div class="image-container">
		<EmptyStateImage />
	</div>
	<h2 class="title font-title">{title}</h2>
	<p class="message font-body">{message}</p>
	{#if $$slots.actions}
		<div class="actions">
			<slot name="actions" />
		</div>
	{/if}
</div>

<style lang="scss">
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		text-align: center;
		padding: $space-4;
		.image-container {
			margin-bottom: $space-4;
			max-width: 256px;
			color: $primary-600;
			flex-grow: 0;
			flex-shrink: 0;
			:global(svg) {
				width: 100%;
				height: 100%;
			}
		}
		.title {
			color: $text-primary;
		}
		.message {
			color: $text-tertiary;
		}
		&.sm {
			.image-container {
				max-width: 128px;
			}
			.title {
				font-size: 1.5rem;
			}
			.message {
				font-size: 1rem;
			}
		}
		&.md {
			&.top-margin {
				margin-top: $space-4;
			}
			.title {
				font-size: 2rem;
			}
			.message {
				font-size: 1.25rem;
			}
		}
		.actions {
			margin-top: $space-4;
		}
	}
</style>
