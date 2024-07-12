<script lang="ts">
	import { Breakpoints } from '$types/breakpoints';

	export let maxWidth: Breakpoints = Breakpoints['2xl'];
</script>

<div
	class="page"
	class:page-sm={maxWidth === Breakpoints.sm}
	class:page-md={maxWidth === Breakpoints.md}
	class:page-lg={maxWidth === Breakpoints.lg}
	class:page-xl={maxWidth === Breakpoints.xl}
	class:page-2xl={maxWidth === Breakpoints['2xl']}
>
	<div class="page-header">
		<slot name="header" />
	</div>
	<div class="page-content">
		{#if $$slots['sidebar-left']}
			<div class="sidebar-left">
				<slot name="sidebar-left" />
			</div>
		{/if}
		<div class="main-content">
			<slot />
		</div>
		{#if $$slots['sidebar-right']}
			<div class="sidebar-right">
				<slot name="sidebar-right" />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		width: 100%;
		margin: 0 auto;
		padding: 0 $space-4;
		background-color: $background-surface;
	}
	.page-sm {
		max-width: $breakpoint-sm;
	}
	.page-md {
		max-width: $breakpoint-md;
	}
	.page-lg {
		max-width: $breakpoint-lg;
	}
	.page-xl {
		max-width: $breakpoint-xl;
	}
	.page-2xl {
		max-width: $breakpoint-2xl;
	}
	.page-header {
		padding: $space-5 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.page-content {
		display: flex;
		flex-grow: 1;
		padding: $space-4 0;
	}

	.sidebar-left {
		flex: 0 0 200px;
	}

	.main-content {
		flex-grow: 1;
	}

	.sidebar-right {
		flex: 0 0 200px;
	}
</style>
