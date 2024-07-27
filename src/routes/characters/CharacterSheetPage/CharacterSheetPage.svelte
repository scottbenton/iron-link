<script lang="ts">
	import { dbStore } from '$lib/db';
	import CharacterSheet from './CharacterSheet.svelte';

	export let characterId: string;

	$: characterPromise = $dbStore.db?.characters.findOne(characterId).exec();
</script>

{#await characterPromise then character}
	{#if character}
		<CharacterSheet {character} />
	{:else}
		<span>Failed to load character: no character found</span>
	{/if}
{:catch}
	<span>Failed to load character: no character found</span>
{/await}
