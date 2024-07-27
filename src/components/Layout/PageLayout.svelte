<script lang="ts">
	import Drawer from '$components/common/Drawer.svelte';
	import { sidebarStore } from '$lib/stores/sidebar.store';
	import { Breakpoints } from '$types/breakpoints';

	export let maxWidth: Breakpoints = Breakpoints['2xl'];
	export let maxHeightScreen = false;
</script>

<div
	class="page"
	class:page-sm={maxWidth === Breakpoints.sm}
	class:page-md={maxWidth === Breakpoints.md}
	class:page-lg={maxWidth === Breakpoints.lg}
	class:page-xl={maxWidth === Breakpoints.xl}
	class:page-2xl={maxWidth === Breakpoints['2xl']}
	class:max-height-screen={maxHeightScreen}
>
	{#if $$slots['header']}
		<div class="page-header">
			<slot name="header" />
		</div>
	{/if}
	<div
		class="page-content"
		class:with-sidebar-left={$$slots['sidebar-left']}
		class:width-sidebar-right={$$slots['sidebar-right']}
	>
		{#if $$slots['sidebar-left']}
			<div class="sidebar sidebar-left">
				<slot name="sidebar-left" />
			</div>
			<Drawer bind:open={$sidebarStore.left}>
				<slot name="sidebar-left" />
			</Drawer>
		{/if}
		<div class="main-content">
			<slot />
		</div>
		{#if $$slots['sidebar-right']}
			<div class="sidebar sidebar-right">
				<slot name="sidebar-right" />
			</div>
			<Drawer bind:open={$sidebarStore.right} side="right">
				<slot name="sidebar-right" />
			</Drawer>
		{/if}
	</div>
</div>

<style lang="scss">
	$page-padding: $space-4;
	.page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
		margin: 0 auto;
		padding: 0 $page-padding;
		background-color: $background-default;
	}

	.page-content {
		display: grid;
		flex-grow: 1;
		align-items: stretch;
		padding: $space-4 0;
		grid-template-columns: 1fr;
	}

	.page-sm {
		max-width: $breakpoint-sm;
	}
	@media (min-width: $breakpoint-sm) {
		.page-sm {
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;
		}
	}
	.page-md {
		max-width: $breakpoint-md;
	}
	@media (min-width: $breakpoint-md) {
		.page-md {
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;
		}
	}
	.page-lg {
		max-width: $breakpoint-lg;
	}
	@media (min-width: $breakpoint-lg) {
		.page-lg {
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;
		}
		.page-content {
			&.with-sidebar-left {
				grid-template-columns: minmax(320px, 320px) 1fr;
			}
			.sidebar-left {
				display: block;
				overflow: hidden;
				overflow-y: auto;
			}
		}
	}
	.page-xl {
		max-width: $breakpoint-xl;
	}
	@media (min-width: $breakpoint-xl) {
		.page-xl {
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;
		}
		.page-content {
			&.width-sidebar-right {
				grid-template-columns: minmax(320px, 320px) 1fr minmax(320px, 1fr);
			}
			.sidebar-right {
				display: block;
			}
		}
	}
	.page-2xl {
		max-width: $breakpoint-2xl;
	}
	@media (min-width: $breakpoint-2xl) {
		.page-2xl {
			border-top-left-radius: $border-radius;
			border-top-right-radius: $border-radius;
		}
	}

	.max-height-screen {
		.main-content,
		.sidebar-left,
		.sidebar-right {
			max-height: calc(100vh - $page-padding * 2);
			overflow: auto;
		}
	}

	.page-header {
		padding: $space-5 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: $space-2;
	}

	.sidebar {
		background-color: $background-inset;
		border: 1px solid $divider;
		border-radius: $border-radius;
	}

	.sidebar-left {
		flex: 0 0 200px;
		display: none;
	}

	.main-content {
		flex-grow: 1;
	}

	.sidebar-right {
		flex: 0 0 200px;
		display: none;
	}
</style>
