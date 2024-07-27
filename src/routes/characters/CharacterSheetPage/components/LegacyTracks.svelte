<script lang="ts">
	import DebouncedProgressTrack from '$components/datasworn/ProgressTracks/DebouncedProgressTrack.svelte';
	import { specialTracks } from '$lib/datasworn/rules';
	import type { CharacterType } from '$lib/db/collections/characterCollection';
	import { i18n } from '$lib/i18n';
	import type { RxDocument } from 'rxdb';
	import { onDestroy } from 'svelte';

	export let character: RxDocument<CharacterType>;

	$: legacyTrackValues = character.legacyTracks ?? {};
	$: legacyTrackSubscription = character.legacyTracks$?.subscribe((newLegacyTrackValues) => {
		legacyTrackValues = newLegacyTrackValues ?? {};
	});

	onDestroy(() => {
		legacyTrackSubscription?.unsubscribe();
	});

	function handleLegacyTrackValueChange(key: string, value: number) {
		character.incrementalModify((char) => {
			if (!char.legacyTracks) {
				char.legacyTracks = {};
			}
			if (!char.legacyTracks[key]) {
				char.legacyTracks[key] = {};
			}
			char.legacyTracks[key].value = value;

			return char;
		});
	}
</script>

<div id={'legacy-tracks-section'}>
	<h2 class={'text-xl font-title'}>{$i18n.t('characterSheet.legacyTracksHeader')}</h2>
	<div class={'legacy-tracks-grid'}>
		{#each Object.entries($specialTracks) as [specialTrackKey, specialTrack]}
			<DebouncedProgressTrack
				label={specialTrack.label}
				value={legacyTrackValues[specialTrackKey]?.value}
				onChange={(value) => handleLegacyTrackValueChange(specialTrackKey, value)}
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	#legacy-tracks-section {
		margin-top: $space-4;
	}
	.legacy-tracks-grid {
		display: flex;
		flex-direction: column;
		gap: $space-2;
		margin-top: $space-1;
	}
</style>
