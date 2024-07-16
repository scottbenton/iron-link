<script lang="ts">
	export let title: string;
</script>

<div class="section-header">
	<h2 class="text-xl font-title">{title}</h2>
	{#if $$slots.action}
		<slot name="action" />
	{/if}
</div>

<style lang="scss">
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: $-space-3;
		margin-right: $-space-3;
		padding: $space-1 $space-3;

		border-radius: $border-radius;

		background-color: $gray-200;

		h2 {
			font-weight: 600;
		}
	}
	@media (max-width: $breakpoint-sm) {
		.section-header {
			flex-direction: column;
		}
	}
</style>
