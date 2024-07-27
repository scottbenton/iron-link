<script lang="ts">
	import ConfirmationDialog from '$components/common/ConfirmationDialog/ConfirmationDialog.svelte';
	import { themeStore, ThemeType } from '$lib/stores/theme.store';
	import AriaLiveAnnouncer from './AriaLiveAnnouncer.svelte';
	import NavBar from './NavBar.svelte';
	import NavRail from './NavRail.svelte';

	import { onMount } from 'svelte';

	const storageKey = 'user-theme';

	// Persist user preference
	$: $themeStore.type && localStorage.setItem(storageKey, $themeStore.type);

	// localStorage and window is only available in the browser
	onMount(() => {
		let localStorageTheme = localStorage.getItem(storageKey) as ThemeType | undefined;
		if (localStorageTheme === ThemeType.Light || localStorageTheme === ThemeType.Dark) {
			$themeStore.type = localStorageTheme;
		}
		if (!$themeStore.type) {
			$themeStore.type = window.matchMedia('(prefers-color-scheme: dark)').matches
				? ThemeType.Dark
				: ThemeType.Light;
		}
	});

	$: $themeStore.type && document.body.setAttribute('data-theme', $themeStore.type);
	$: $themeStore.colorScheme &&
		document.body.setAttribute('data-color-scheme', $themeStore.colorScheme);
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
		color: $text-primary;
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
