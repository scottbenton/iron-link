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

	$: user = $authStore.user;
	$: isAnonymous = user?.isAnonymous;

	const {
		elements: { trigger, menu, item },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true
	});

	const toggleTheme = () => {
		$themeStore.type = $themeStore.type === ThemeType.Light ? ThemeType.Dark : ThemeType.Light;
	};
</script>

<IconButton meltAction={$trigger} label={$i18n.t('settingsMenu.openButtonAriaLabel')}>
	<SettingsIcon font-size="1.25rem" />
</IconButton>

{#if $open}
	<div class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
		{#if isDevEnvironment}
			<div>{user?.uid}</div>
		{/if}
		<div class="item" use:melt={$item} on:m-click={() => toggleTheme()}>
			{#if $themeStore.type === ThemeType.Light}
				<div class="item-icon"><DarkThemeIcon /></div>
				{$i18n.t('settingsMenu.darkTheme')}
			{:else}
				<div class="item-icon"><LightThemeIcon /></div>
				{$i18n.t('settingsMenu.lightTheme')}
			{/if}
		</div>
		{#if user}
			{#if !isAnonymous || isDevEnvironment}
				<div class="item" use:melt={$item} on:m-click={() => signOut()}>
					<div class="item-icon"><LogoutIcon /></div>
					{$i18n.t('settingsMenu.logout')}
				</div>
			{/if}
		{/if}
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

		.item {
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
	}
</style>
