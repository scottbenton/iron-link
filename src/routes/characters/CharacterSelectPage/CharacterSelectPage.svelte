<script lang="ts">
	import { Link } from 'svelte-routing';
	import { i18n } from '../../../lib';
	import PageLayout from '$components/Layout/PageLayout.svelte';
	import AddIcon from 'virtual:icons/tabler/plus';
	import GridList from '$components/Layout/GridList.svelte';
	import { getDatabase } from '../../../lib/db/rxdb';
	import type { CharacterType } from '../../../lib/db/collections/characterCollection';
	const db = getDatabase();

	let characters: CharacterType[] = [];

	$: db.characters?.find().$.subscribe((chars) => {
		characters = chars.sort((c1, c2) => c1.name.localeCompare(c2.name));
	});
</script>

<PageLayout>
	<svelte:fragment slot="header">
		<h1 class="font-title text-4xl">
			{$i18n.t('characters.capital_character', { count: 100 })}
		</h1>
		<Link to="/characters/add">
			<div class="primary-button">
				<div>
					{$i18n.t('characters.create')}
					<div class="icon"><AddIcon /></div>
				</div>
			</div>
		</Link>
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
		background-color: var(--color-surface);
		border-radius: var(--border-radius);
		padding: var(--space-4);
		border: 1px solid $divider;
		cursor: pointer;
		&:hover {
			background-color: $gray-200;
		}
	}
</style>
