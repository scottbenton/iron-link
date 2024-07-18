<script lang="ts">
	import IronLinkLogo from '$assets/IronLinkLogo.svelte';
	import HamburgerMenuIcon from 'virtual:icons/tabler/menu-2';
	import Drawer from '../common/Drawer.svelte';
	import { i18n } from '$lib/i18n';
	import CharacterIcon from 'virtual:icons/tabler/user';
	import CampaignIcon from 'virtual:icons/tabler/users-group';
	import WorldIcon from 'virtual:icons/tabler/globe';
	import HomebrewIcon from 'virtual:icons/tabler/pencil';
	import { Link, useLocation } from 'svelte-routing';
	import SettingsMenu from './SettingsMenu.svelte';
	import IconButton from '$components/IconButton.svelte';

	const location = useLocation();

	$: activePath = $location.pathname.split('/')[1];

	const rootPaths: { path: string; Icon: any; label: string }[] = [
		{
			path: 'characters',
			Icon: CharacterIcon,
			label: $i18n.t('characters.capital_character', { count: 10 })
		},
		{
			path: 'campaigns',
			Icon: CampaignIcon,
			label: $i18n.t('campaigns.capital_campaign', { count: 10 })
		},
		{
			path: 'worlds',
			Icon: WorldIcon,
			label: $i18n.t('worlds.capital_world', { count: 10 })
		},
		{
			path: 'homebrew',
			Icon: HomebrewIcon,
			label: $i18n.t('homebrew.capital_homebrew', { count: 10 })
		}
	];
</script>

<header class="page-container">
	<div class="left-nav">
		<Drawer
			title={$i18n.t('screen-reader.navigation-title')}
			description={$i18n.t('screen-reader.navigation-description')}
			let:closeDialog
		>
			<svelte:fragment slot="trigger" let:trigger>
				<IconButton label={$i18n.t('nav.openNavDrawer')} meltAction={trigger}>
					<HamburgerMenuIcon />
				</IconButton>
			</svelte:fragment>
			<ul>
				{#each rootPaths as { path, Icon, label }}
					<li>
						<Link
							on:click={() => {
								closeDialog && closeDialog();
							}}
							to={`/${path}`}
							class="nav-drawer-item"
						>
							<div class="nav-link" class:active={activePath === path}>
								<div class="icon"><Icon /></div>
								<span class="name">{label}</span>
							</div>
						</Link>
					</li>
				{/each}
			</ul>
		</Drawer>
		<div class="logo-container-mobile"><IronLinkLogo /></div>
		<h1 class="font-title text-2xl">Iron Link</h1>
	</div>
	<SettingsMenu />
</header>

<style lang="scss">
	header {
		display: flex;
		padding-top: $space-2;
		padding-bottom: $space-2;
		background-color: $gray-800;
		color: #fff;
		justify-content: space-between;
	}
	@media (min-width: $breakpoint-sm) {
		header {
			display: none;
		}
	}

	ul {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	li {
		color: $text-primary;
		.icon {
			flex-shrink: 0;
		}
		.name {
			flex-shrink: 0;
			margin-left: $space-4;
		}
	}

	:global(.nav-drawer-item) {
		color: inherit;
		text-decoration: none;
	}

	.nav-link {
		display: flex;
		align-items: center;
		padding: $space-3 $space-6;
		padding-left: $space-4;
		&:hover {
			background-color: $background-hover;
		}
	}

	.left-nav {
		display: flex;
		align-items: center;
	}
	.logo-container-mobile {
		margin-left: $space-1;
		margin-right: $space-2;
		width: $space-8;
	}
</style>
