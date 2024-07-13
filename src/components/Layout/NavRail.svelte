<script lang="ts">
	import { Link, useLocation } from 'svelte-routing';
	import IronLinkLogo from '$assets/IronLinkLogo.svelte';
	import CharacterIcon from 'virtual:icons/tabler/user';
	import CampaignIcon from 'virtual:icons/tabler/users-group';
	import WorldIcon from 'virtual:icons/tabler/globe';
	import HomebrewIcon from 'virtual:icons/tabler/pencil';
	import { i18n } from '$lib/i18n';

	const location = useLocation();

	$: activePath = $location.pathname.split('/')[1];

	const rootPaths: { path: string; Icon: typeof CharacterIcon; label: string }[] = [
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

<nav class="nav-rail">
	<div class="logo-container">
		<IronLinkLogo />
	</div>

	{#each rootPaths as { path, Icon, label }}
		<Link to={`/${path}`} class="nav-rail-item">
			<div class="nav-link" class:active={activePath === path}>
				<div class="icon-container">
					<div class="icon"><Icon style={`font-size: 1.25rem`} /></div>
				</div>
				<span class="name text-xs">{label}</span>
			</div>
		</Link>
	{/each}
</nav>

<style lang="scss">
	$transitionDuration: 200ms;

	.nav-rail {
		display: none;
	}
	@media (min-width: $breakpoint-sm) {
		.nav-rail {
			background-color: $gray-700;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: $space-4 $space-2;
			border-right: 1px solid $gray-800;
		}
	}

	:global(.nav-rail-item) {
		text-decoration: none;
		margin-top: $space-3;
	}
	:global(.nav-rail-item:hover .nav-link .icon-container .icon) {
		background-color: $gray-600;
	}
	:global(.nav-rail-item:hover .nav-link.active .icon-container .icon) {
		background-color: $gray-900;
	}

	.logo-container {
		margin-bottom: $space-4;
		width: $space-12;
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: $gray-200;
		.icon {
			border-radius: 999px;
			padding: $space-1_5 $space-4_5;
			background-color: $gray-700;
			transition-property: padding margin background-color color;
			transition-timing-function: ease-in-out;
			transition-duration: $transitionDuration;
		}
		.name {
			font-weight: 600;
		}
		.icon-container {
			margin-bottom: $space-0_5;
		}
	}
	.nav-link.active {
		color: #fff;
		.icon-container {
			position: relative;
			overflow: hidden;
			border-radius: 999px;
			&::before {
				content: '';
				display: block;
				position: absolute;
				z-index: 1;
				left: -10px;
				top: -10px;
				right: -10px;
				bottom: -10px;
				aspect-ratio: 1;
				border-radius: inherit;
				background: $primary-gradient;

				opacity: 100%;

				animation: spin 4s linear infinite;
			}
		}
		.icon {
			background-color: $gray-800;
			color: #fff;
			position: relative;
			z-index: 2;
			margin: $space-0_5;
			padding: $space-1 $space-4;
		}
	}
</style>
