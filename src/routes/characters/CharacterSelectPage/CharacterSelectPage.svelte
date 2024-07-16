<script lang="ts">
	import { Link } from 'svelte-routing';
	import { i18n } from '../../../lib';
	import PageLayout from '$components/Layout/PageLayout.svelte';
	import AddIcon from 'virtual:icons/tabler/plus';
	import GridList from '$components/Layout/GridList.svelte';
	import type { CharacterType } from '../../../lib/db/collections/characterCollection';
	import { getDB } from '$lib/db/rxdb';
	import Button from '$components/common/Button.svelte';

	let characters: CharacterType[] = [];

	$: getDB()
		.characters?.find()
		.$.subscribe((chars) => {
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
					{item.name}
				</div>
			</Link>
		</svelte:fragment>
	</GridList>
</PageLayout>

<style lang="scss">
	:global(.character-link) {
		text-decoration: none;
		color: inherit;
	}

	.character-card {
		background-color: $background-surface;
		border-radius: $border-radius;
		padding: $space-4;
		border: 1px solid $divider;
		cursor: pointer;
		&:hover {
			background-color: $gray-200;
		}
	}
</style>
