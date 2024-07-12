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
		margin-left: $-space-4;
		margin-right: $-space-4;
		padding: $space-1 $space-4;

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
