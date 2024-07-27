<script lang="ts">
	import SettingsIcon from 'virtual:icons/tabler/settings';
	import LogoutIcon from 'virtual:icons/tabler/logout';
	import { authStore, signOut } from '$lib/firebase/auth';
	import IconButton from '$components/IconButton.svelte';
	import { i18n } from '$lib/i18n';
	import { isDevEnvironment } from '$lib/index';
	import LightThemeIcon from 'virtual:icons/tabler/sun';
	import DarkThemeIcon from 'virtual:icons/tabler/moon';
	import { themeStore, ThemeType } from '$lib/stores/theme.store';
	import Menu from '$components/common/Menu/Menu.svelte';
	import MenuItem from '$components/common/Menu/MenuItem.svelte';

	$: user = $authStore.user;
	$: isAnonymous = user?.isAnonymous;

	const toggleTheme = () => {
		$themeStore.type = $themeStore.type === ThemeType.Light ? ThemeType.Dark : ThemeType.Light;
	};
</script>

<Menu>
	<svelte:fragment slot="trigger" let:trigger>
		<IconButton meltAction={trigger} label={$i18n.t('settingsMenu.openButtonAriaLabel')}>
			<SettingsIcon font-size="1.25rem" />
		</IconButton>
	</svelte:fragment>
	<svelte:fragment slot="menu-items" let:item>
		{#if isDevEnvironment}
			<div>{user?.uid}</div>
		{/if}
		<MenuItem meltItem={item} onClick={() => toggleTheme()}>
			{#if $themeStore.type === ThemeType.Light}
				<div class="item-icon"><DarkThemeIcon /></div>
				{$i18n.t('settingsMenu.darkTheme')}
			{:else}
				<div class="item-icon"><LightThemeIcon /></div>
				{$i18n.t('settingsMenu.lightTheme')}
			{/if}
		</MenuItem>
		{#if user}
			{#if !isAnonymous || isDevEnvironment}
				<MenuItem meltItem={item} onClick={() => signOut()}>
					<div class="item-icon"><LogoutIcon /></div>
					{$i18n.t('settingsMenu.logout')}
				</MenuItem>
			{/if}
		{/if}
	</svelte:fragment>
</Menu>

<style lang="scss">
	.item-icon {
		color: $text-tertiary;
		margin-right: $space-4;
	}
</style>
