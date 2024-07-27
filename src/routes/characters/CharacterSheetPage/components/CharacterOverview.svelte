<script lang="ts">
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import CharacterImage from '$components/common/CharacterImage.svelte';
	import InitiativeButtons from '../components/InitiativeButtons.svelte';
	import type { RxDocument } from 'rxdb';
	import { onDestroy } from 'svelte';

	export let character: RxDocument<CharacterType>;

	$: name = character.name;
	$: personalDetails = undefined as string | undefined;
	$: nameSubscription = character.name$.subscribe((newName) => {
		name = newName;
	});
	$: detailSubscription = character.personalDetails$?.subscribe((details) => {
		personalDetails = details
			? Object.values(details)
					.filter((detail) => detail?.trim())
					.join(' | ')
			: undefined;
	});

	onDestroy(() => {
		nameSubscription?.unsubscribe();
		detailSubscription?.unsubscribe();
	});
</script>

<div class="character-overview">
	{#if character.portrait}
		<div class="character-portrait">
			<CharacterImage {character} size={'sm'} />
		</div>
	{/if}
	<div>
		<h1 class="font-title text-3xl">{name}</h1>
		{#if personalDetails}
			<div class="text-sm details">
				{personalDetails}
			</div>
		{/if}
		<InitiativeButtons {character} />
	</div>
</div>

<style lang="scss">
	.character-overview {
		margin-top: $space-4;
		display: flex;
		align-items: center;
		color: $text-secondary;
		.character-portrait {
			margin-right: $space-2;
		}
		.details {
			color: $text-secondary;
		}
	}
</style>
