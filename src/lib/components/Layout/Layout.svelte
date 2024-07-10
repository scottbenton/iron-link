<script lang="ts">
	import NavBar from './NavBar.svelte';
	import NavRail from './NavRail.svelte';
</script>

<div id="layout">
	<NavBar />
	<NavRail />
	<main><slot /></main>
</div>

<style lang="scss">
	#layout {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}
	main {
		flex-grow: 1;
	}
	@media (min-width: $breakpoint-sm) {
		#layout {
			flex-direction: row;
			align-items: stretch;
			overflow: hidden;
		}
		main {
			max-height: 100vh;
			overflow: auto;
		}
	}
</style>
