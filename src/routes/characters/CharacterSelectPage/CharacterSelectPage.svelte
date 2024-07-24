<script lang="ts">
	import { Link } from 'svelte-routing';
	import { i18n } from '../../../lib';
	import PageLayout from '$components/Layout/PageLayout.svelte';
	import AddIcon from 'virtual:icons/tabler/plus';
	import GridList from '$components/Layout/GridList.svelte';
	import type { CharacterType } from '../../../lib/db/collections/characterCollection';
	import Button from '$components/common/Button.svelte';
	import { dbStore } from '$lib/db';
	import CharacterImage from '$components/common/CharacterImage.svelte';
	import type { RxDocument } from 'rxdb';
	import EmptyState from '$components/common/EmptyState.svelte';

	let characters: RxDocument<CharacterType>[] = [];

	$: $dbStore.db?.characters?.find().$.subscribe((chars) => {
		characters = chars.sort((c1, c2) => c1.name.localeCompare(c2.name));
	});
</script>

<PageLayout>
	<svelte:fragment slot="header">
		<h1 class="font-title text-4xl">
			{$i18n.t('characters.capital_character', { count: 100 })}
		</h1>
		<Button href="/characters/add" variant="primary-gradient">
			{$i18n.t('characters.create')}
			<svelte:fragment slot="endIcon">
				<AddIcon />
			</svelte:fragment>
		</Button>
	</svelte:fragment>
	<GridList items={characters}>
		<svelte:fragment slot="item" let:item>
			<Link class="character-link" to={`/characters/${item._id}`}>
				<div class="character-card">
					<CharacterImage character={item} size={'xs'} />
					<span class="card-name font-title text-2xl">{item.name}</span>
				</div>
			</Link>
		</svelte:fragment>
		<svelte:fragment slot="emptyState">
			<EmptyState
				title={$i18n.t('characters.emptyStateTitle')}
				message={$i18n.t('characters.emptyState')}
				includeTopMargin
			/>
		</svelte:fragment>
	</GridList>
</PageLayout>

<style lang="scss">
	:global(.character-link) {
		text-decoration: none;
		color: inherit;
	}

	.character-card {
		display: flex;
		align-items: flex-start;
		background-color: $background-default;
		border-radius: $border-radius;
		padding: $space-2;
		border: 1px solid $divider;

		transition-property: background-color;
		transition-duration: 150ms;
		transition-timing-function: ease-in-out;

		cursor: pointer;
		&:hover {
			background-color: $background-hover;
		}
		.card-name {
			color: $text-secondary;
			margin-left: $space-4;
		}
	}
</style>
