<script lang="ts">
	import { melt } from '@melt-ui/svelte';

	export let onClick: () => void;
	export let meltItem: any;
</script>

<div class="menu-item" use:melt={meltItem} on:m-click={() => onClick()}>
	<slot />
</div>

<style lang="scss">
	.menu-item {
		display: flex;
		align-items: center;
		padding: $space-2 $space-4;
		color: $text-secondary;
		min-width: 12rem;

		cursor: pointer;

		&[data-highlighted] {
			background-color: $background-hover;
		}

		.item-icon {
			color: $text-tertiary;
			margin-right: $space-4;
		}
	}
</style>
