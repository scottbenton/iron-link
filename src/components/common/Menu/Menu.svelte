<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import SettingsIcon from 'virtual:icons/tabler/settings';
	import LogoutIcon from 'virtual:icons/tabler/logout';
	import { authStore, signOut } from '$lib/firebase/auth';
	import IconButton from '$components/IconButton.svelte';
	import { i18n } from '$lib/i18n';
	import { isDevEnvironment } from '$lib/index';
	import LightThemeIcon from 'virtual:icons/tabler/sun';
	import DarkThemeIcon from 'virtual:icons/tabler/moon';
	import { themeStore, ThemeType } from '$lib/stores/theme.store';

	const {
		elements: { trigger, menu, item },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true
	});
</script>

<slot name="trigger" trigger={$trigger} />

{#if $open}
	<div class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
		<slot name="menu-items" item={$item} />
		<!-- <div class="separator" use:melt={$separator} /> -->
	</div>
{/if}

<style lang="scss">
	.menu {
		z-index: 40;
		display: flex;
		flex-direction: column;
		border-radius: $border-radius;
		background-color: $background-default;
		color: $text-primary;
		border: 1px solid $divider;
		padding: $space-2 0;
	}
</style>
