<script lang="ts">
	import IronLinkLogo from '../../../assets/IronLinkLogo.svelte';
	import HamburgerMenuIcon from 'virtual:icons/tabler/menu-2';
	import Drawer from '../common/Drawer.svelte';
	import { melt } from '@melt-ui/svelte';
	import { i18n } from '../../i18n';
	import CharacterIcon from 'virtual:icons/tabler/user';
	import CampaignIcon from 'virtual:icons/tabler/users-group';
	import WorldIcon from 'virtual:icons/tabler/globe';
	import HomebrewIcon from 'virtual:icons/tabler/pencil';
	import { Link, useLocation } from 'svelte-routing';

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

<nav class="page-container">
	<div id="logo-mark">
		<Drawer
			title={$i18n.t('screen-reader.navigation-title')}
			description={$i18n.t('screen-reader.navigation-description')}
			let:closeDialog
		>
			<button class="icon-button" slot="trigger" let:trigger use:melt={trigger}>
				<HamburgerMenuIcon />
			</button>
			<ul>
				{#each rootPaths as { path, Icon, label }}
					<li>
						<Link
							on:click={() => {
								closeDialog && closeDialog();
							}}
							to={`/${path}`}
							class="nav-link-item"
						>
							<div id="nav-link" class:active={activePath === path}>
								<div id="icon"><Icon /></div>
								<span id="name">{label}</span>
							</div>
						</Link>
					</li>
				{/each}
			</ul>
		</Drawer>
		<div id="logo-container-mobile"><IronLinkLogo /></div>
		<h1 class="font-title text-2xl">Iron Link</h1>
	</div>
</nav>

<style lang="scss">
	nav {
		display: flex;
		padding-top: $space-2;
		padding-bottom: $space-2;
		background-color: $gray-700;
		color: #fff;
	}
	@media (min-width: $breakpoint-sm) {
		nav {
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
		:hover {
			background-color: $gray-200;
		}
		#icon {
			flex-shrink: 0;
		}
		#name {
			flex-shrink: 0;
			margin-left: $space-2;
		}
	}

	:global(.nav-link-item) {
		color: inherit;
		text-decoration: none;
	}

	#nav-link {
		display: flex;
		align-items: center;
		padding: $space-3 $space-6;
		padding-left: $space-4;
	}

	#logo-mark {
		display: flex;
		align-items: center;
	}
	#logo-container-mobile {
		margin-left: $space-1;
		margin-right: $space-2;
		width: $space-8;
	}
</style>
