<script lang="ts">
	import ConfirmationDialog from '$components/common/ConfirmationDialog/ConfirmationDialog.svelte';
	import AriaLiveAnnouncer from './AriaLiveAnnouncer.svelte';
	import NavBar from './NavBar.svelte';
	import NavRail from './NavRail.svelte';
</script>

<div class="layout">
	<AriaLiveAnnouncer />
	<NavBar />
	<NavRail />
	<main>
		<slot />
	</main>
	<ConfirmationDialog />
</div>

<style lang="scss">
	.layout {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}
	main {
		flex-grow: 1;
		background-color: $background-default;
	}
	@media (min-width: $breakpoint-sm) {
		.layout {
			flex-direction: row;
			align-items: stretch;
			overflow: hidden;
		}
		main {
			max-height: 100vh;
			overflow: auto;
		}
	}
	.page-header {
		padding: $space-2 0;
	}
	.page-content {
		flex-grow: 1;
		padding: $space-2 0;
	}
</style>
